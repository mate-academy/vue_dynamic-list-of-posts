<script setup>
import { ref, watch, computed } from "vue";
import * as commentApi from "../api/comments";
import PostLoader from "./PostLoader.vue";
import WriteCommentBtn from "./WriteCommentBtn.vue";
import CommentsList from "./CommentsList.vue";
import CommentForm from "./CommentForm.vue";
import EditPost from "./EditPost.vue";

const props = defineProps({
  user: Object,
  selectedPost: Object,
});

const emit = defineEmits(["postUpdated", "postDelete"]);

const isLoading = ref(true);
const isEditPost = ref(false);
const commentsError = ref("");
const deleteCommentsError = ref("");
const comments = ref([]);
const isWriteComment = ref(false);
const prevComment = ref(null);

const loadComments = async (postId) => {
  if (!postId || postId === -1) return;

  try {
    isLoading.value = true;
    commentsError.value = "";
    comments.value = [];

    const res = await commentApi.getComments(postId);

    comments.value = res;
  } catch (error) {
    console.error("Failed to load comments:", error);
    commentsError.value = "Failed to load comments. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};

const hasComments = computed(() => {
  return comments.value.length > 0;
});

const deleteComment = async (commentId) => {
  const previousComments = [...comments.value];

  comments.value = comments.value.filter(
    (comment) => comment.id !== commentId,
  );

  try {
    await commentApi.deleteComment(commentId);
  } catch (error) {
    console.error("Could not delete comment:", error);
    comments.value = previousComments;
    deleteCommentsError.value = "Could not delete comment. Please try again later.";
  }
};

watch(
  () => props.selectedPost?.id,
  (newId) => {
    loadComments(newId);
    isWriteComment.value = false;
  },
  { immediate: true },
);

const handleCommentAdd = (newComment) => {
  comments.value.push(newComment);
  prevComment.value = newComment;
};
</script>

<template>
  <EditPost
    v-if="isEditPost"
    :user="user"
    :post="selectedPost"
    @setEditPost="isEditPost = $event"
    @postUpdated="$emit('postUpdated', $event)"
  />
  <div v-else class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ selectedPost.id }}: {{ selectedPost.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable">
          <i class="fas fa-pen-to-square" @click="isEditPost = true"></i>
        </span>
        <span class="icon is-small is-right has-text-danger is-clickable ml-3">
          <i class="fas fa-trash" @click="emit('postDelete', selectedPost)"></i>
        </span>
      </div>
    </div>

    <p>{{ selectedPost.body }}</p>

    <PostLoader v-if="isLoading" />
    <template v-else>
      <CommentForm
        v-if="isWriteComment"
        :postId="selectedPost.id"
        :prevComment="prevComment"
        @commentAdded="handleCommentAdd"
        @setWriteComment="isWriteComment = $event"
      />

      <template v-else>
        <p v-if="commentsError" class="has-text-danger">
          {{ commentsError }}
        </p>

        <template v-else-if="hasComments" >
          <CommentsList          
            :comments="comments"
            @deleteComment="deleteComment"
          />
  
          <div v-if="deleteCommentsError" class="notification is-danger is-light mb-4">
            <button class="delete" @click="deleteCommentsError = ''"></button>
            {{ deleteCommentsError }}
          </div>
        </template>

        <p v-else>No Comments</p>

        <WriteCommentBtn @setWriteComment="isWriteComment = $event" />
      </template>
    </template>
  </div>
</template>
