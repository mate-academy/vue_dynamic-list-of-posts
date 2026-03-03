<template>
  <div class="mt-5">
    <Loader v-if="isLoading" />

    <div v-else-if="hasError" class="notification is-danger">
      Comments loading error
    </div>

    <div v-else-if="comments.length === 0" class="block">
      <p class="title is-4">No comments yet</p>
    </div>

    <div v-else>
      <h3 class="title is-5">Comments:</h3>
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="message is-small"
      >
        <div class="message-header">
          <a :href="`mailto:${comment.email}`">
            {{ comment.name }}
          </a>

          <button
            type="button"
            class="delete is-small"
            aria-label="delete"
            @click="handleDelete(comment.id)"
          ></button>
        </div>
        <div class="message-body">
          {{ comment.body }}
        </div>
      </article>
    </div>

    <div class="mt-5">
      <button
        v-if="!showForm"
        type="button"
        class="button is-link"
        @click="showForm = true"
      >
        Write a comment
      </button>

      <CommentForm v-else :postId="postId" @comment-added="addCommentToList" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getComments, deleteComment } from "../api/posts";
import Loader from "./Loader.vue";
import CommentForm from "./CommentForm.vue";

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
});

const comments = ref([]);
const isLoading = ref(false);
const hasError = ref(false);
const showForm = ref(false);

const loadComments = async () => {
  isLoading.value = true;
  hasError.value = false;
  showForm.value = false;
  try {
    comments.value = await getComments(props.postId);
  } catch (e) {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadComments);
watch(() => props.postId, loadComments);

const handleDelete = async (commentId) => {
  const originalComments = [...comments.value];

  comments.value = comments.value.filter((c) => c.id !== commentId);

  try {
    await deleteComment(commentId);
  } catch (e) {
    alert("Failed to delete comment. Retrying...");
    comments.value = originalComments;
  }
};

const addCommentToList = (newComment) => {
  comments.value.push(newComment);
};
</script>
