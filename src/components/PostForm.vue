<script setup>
import { ref, watch } from "vue";
import * as api from "../api/post.js";
import PostLoader from "./PostLoader.vue";
import CommentList from "./CommentList.vue";
import CommentForm from "./CommentForm.vue";

const props = defineProps({
  post: Object,
  submitError: { type: Boolean, default: false },
  deleteError: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "submitted", "delete", "cancel"]);

const title = ref("");
const body = ref("");
const isEditing = ref(false);
const errors = ref({ title: false, body: false });

const comments = ref([]);
const isLoadingComments = ref(false);
const commentsError = ref(false);
const showCommentForm = ref(false);
const addCommentError = ref(false);
const deleteCommentError = ref(false);

const isSubmittingComment = ref(false);

const fetchComments = async (postId) => {
  isLoadingComments.value = true;
  commentsError.value = false;
  try {
    comments.value = await api.getComments(postId);
  } catch (err) {
    commentsError.value = true;
  } finally {
    isLoadingComments.value = false;
  }
};

watch(
  () => props.post,
  (newPost) => {
    isEditing.value = false;
    title.value = newPost?.title || "";
    body.value = newPost?.body || "";
    errors.value = { title: false, body: false };
    comments.value = [];
    showCommentForm.value = false;
    if (newPost?.id) {
      fetchComments(newPost.id);
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  errors.value.title = !title.value.trim();
  errors.value.body = !body.value.trim();
  if (errors.value.title || errors.value.body) return;
  emit("submitted", {
    title: title.value,
    body: body.value,
    id: props.post?.id,
  });
};

const handleCancel = () => {
  if (isEditing.value && props.post) {
    isEditing.value = false;
  } else {
    emit("close");
  }
};

const handleAddComment = async (data) => {
  isSubmittingComment.value = true;
  addCommentError.value = false;
  try {
    const newComment = await api.createComment({
      ...data,
      postId: props.post.id,
    });
    comments.value.push(newComment);
    showCommentForm.value = false;
  } catch (err) {
    addCommentError.value = true;
  } finally {
    isSubmittingComment.value = false;
  }
};

const handleDeleteComment = async (commentId) => {
  deleteCommentError.value = false;
  comments.value = comments.value.filter((c) => c.id !== commentId);
  try {
    await api.deleteComment(commentId);
  } catch (err) {
    deleteCommentError.value = true;
  }
};
</script>

<template>
  <div class="tile is-child box">
    <div class="content">
      <div v-if="post && !isEditing">
        <div
          class="block is-flex is-justify-content-space-between is-align-items-center">
          <h2>#{{ post.id }}: {{ post.title }}</h2>
          <div class="is-flex">
            <span
              class="icon is-small is-right is-clickable"
              @click="isEditing = true">
              <i class="fas fa-pen-to-square"></i>
            </span>
            <span
              class="icon is-small is-right has-text-danger is-clickable ml-3"
              @click="$emit('delete', post.id)">
              <i class="fas fa-trash"></i>
            </span>
          </div>
        </div>

        <p>{{ post.body }}</p>

        <CommentList
          :comments="comments"
          :is-loading="isLoadingComments"
          :has-error="commentsError"
          @delete-comment="handleDeleteComment" />

        <button
          v-if="!showCommentForm && !isLoadingComments && !commentsError"
          type="button"
          class="button is-link"
          @click="showCommentForm = true">
          Write a comment
        </button>

        <div v-if="submitError" class="notification is-danger">
          Error saving post. Please try again.
        </div>
        <div v-if="deleteError" class="notification is-danger">
          Error deleting post. Please try again.
        </div>
        <div v-if="addCommentError" class="notification is-danger">
          Error adding comment. Please try again.
        </div>

        <div v-if="deleteCommentError" class="notification is-danger">
          Error deleting comment. Please try again.
        </div>

        <CommentForm
          v-if="showCommentForm"
          :is-submitting="isSubmittingComment"
          @submitted="handleAddComment"
          @cancel="showCommentForm = false" />
      </div>

      <div v-else>
        <h2>{{ post ? "Edit post" : "Create new post" }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="field" data-cy="NameField">
            <label class="label" for="post-title">Title</label>
            <div class="control has-icons-left has-icons-right">
              <input
                v-model="title"
                type="text"
                id="post-title"
                placeholder="Post title"
                class="input"
                :class="{ 'is-danger': errors.title }" />
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
              <span
                v-if="errors.title"
                class="icon is-small is-right has-text-danger"
                data-cy="ErrorIcon">
                <i class="fas fa-exclamation-triangle"></i>
              </span>
            </div>
            <p
              v-if="errors.title"
              class="help is-danger"
              data-cy="ErrorMessage">
              Title is required
            </p>
          </div>

          <div class="field" data-cy="BodyField">
            <label class="label" for="post-body">Write Post Body</label>
            <div class="control">
              <textarea
                v-model="body"
                id="post-body"
                placeholder="Post body"
                class="textarea"
                :class="{ 'is-danger': errors.body }"></textarea>
            </div>
            <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">
              Body is required
            </p>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button type="submit" class="button is-link">
                {{ post ? "Save" : "Create" }}
              </button>
            </div>
            <div class="control">
              <button
                type="button"
                class="button is-link is-light"
                @click="handleCancel">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
