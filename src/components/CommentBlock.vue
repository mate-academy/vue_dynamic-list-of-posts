<script setup>
import { ref, onMounted, watch } from 'vue';
import { addCommentToServer, deleteCommentFromServer, getComments } from '@/API/comments';
import CommentList from './CommentList.vue';
import CommentForm from './CommentForm.vue';

const props = defineProps({
  postId: Number,
})

const comments = ref([]);
const errorMessage = ref('');
const addingComment = ref(false);

onMounted(async () => {
  await getComment(props.postId);
})

watch(() => props.postId, async (newPostId) => {
  await getComment(newPostId);
  addingComment.value = false;
})

const getComment = async (postId) => {
  try {
    comments.value = await getComments(postId);
  } catch {
    errorMessage.value = 'Unable to load comments';
  }
};

const addComment = async (commentData) => {
  try {
    const newComment = await addCommentToServer(commentData);
    comments.value.push(newComment);
    addingComment.value = false;
  } catch {
    errorMessage.value = 'Unable to add comment';
  }
};

const deleteComment = async (commentId) => {
  try {
    await deleteCommentFromServer(commentId);
    comments.value = comments.value.filter(({ id }) => id !== commentId);
  } catch {
    errorMessage.value = 'Unable to delete comment';
  }
};

const handleCloseForm = () => {
  addingComment.value = false;
};

const handleOpenCommentForm = () => {
  addingComment.value = true;
};

</script>

<template>
  <div class="block">
    <CommentForm v-if="addingComment" :post-id="postId" @close-form="handleCloseForm" @submit="addComment($event)" />

    <template v-else>
      <p v-if="!comments.length" class="title is-4">No comments yet</p>
      <CommentList v-else :comments="comments" @delete-comment="deleteComment($event)" />

      <button type="button" class="button is-link" @click="handleOpenCommentForm">
        Write a comment
      </button>
    </template>
  </div>
</template>

<style></style>