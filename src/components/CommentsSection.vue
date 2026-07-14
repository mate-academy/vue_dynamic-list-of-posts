<script setup>
import { ref, watch, onMounted } from 'vue';

import { getComments, deleteComment } from '../api/api';
import Loader from './Loader.vue';
import CommentItem from './CommentItem.vue';
import NewCommentForm from './NewCommentForm.vue';

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
});

const comments = ref([]);
const isLoading = ref(false);
const errorMsg = ref('');
const actionError = ref('');
const showCommentForm = ref(false);

const loadComments = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  actionError.value = '';
  comments.value = [];

  try {
    const fetchedComments = await getComments(props.postId);
    comments.value = fetchedComments;
  } catch (error) {
    errorMsg.value = 'Failed to load comments.';
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.postId, () => {
  showCommentForm.value = false;
  loadComments();
}, { immediate: true });

const handleCommentAdded = (newComment) => {
  comments.value.push(newComment);
  actionError.value = '';
};

const handleFormError = (msg) => {
  actionError.value = msg;
};

const handleDeleteComment = async (commentId) => {
  const index = comments.value.findIndex(c => c.id === commentId);
  if (index === -1) return;

  const deletedComment = comments.value[index];
  comments.value.splice(index, 1);
  actionError.value = '';

  try {
    await deleteComment(commentId);
  } catch (error) {
    comments.value.splice(index, 0, deletedComment);
    actionError.value = 'Failed to delete comment. Please try again.';
  }
};

const closeActionError = () => {
  actionError.value = '';
};
</script>

<template>
  <div class="block">
    <div v-if="isLoading" class="is-flex is-justify-content-center is-align-items-center mt-2">
      <Loader />
    </div>

    <div v-else-if="errorMsg" class="notification is-danger">
      <button @click="errorMsg = ''" class="delete" aria-label="close"></button>
      {{ errorMsg }}
      <button @click="loadComments" class="button is-small is-danger is-light ml-2">
        Retry
      </button>
    </div>

    <div v-else>
      <div v-if="actionError" class="notification is-danger">
        <button @click="closeActionError" class="delete" aria-label="close"></button>
        {{ actionError }}
      </div>

      <div v-if="comments.length === 0" class="block">
        <p class="title is-4">No comments yet</p>
      </div>

      <div v-else class="block">
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @delete="handleDeleteComment(comment.id)"
        />
      </div>

      <button
        v-if="!showCommentForm"
        @click="showCommentForm = true"
        type="button"
        class="button is-link"
      >
        Write a comment
      </button>

      <NewCommentForm
        v-else
        :post-id="postId"
        @comment-added="handleCommentAdded"
        @error="handleFormError"
      />
    </div>
  </div>
</template>
