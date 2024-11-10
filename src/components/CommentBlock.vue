<script setup>
import { ref, onMounted, watch } from 'vue';
import { addCommentToServer, deleteCommentFromServer, getComments } from '@/API/comments';
import CommentList from './CommentList.vue';
import CommentForm from './CommentForm.vue';
import PostLoader from './PostLoader.vue';
import Message from './Message.vue';

const props = defineProps({
  postId: Number,
})

const loading = ref(true);
const adding = ref(false);
const comments = ref([]);
const error = ref('');
const openCommentForm = ref(false);

onMounted(async () => {
  await getComment(props.postId);
})

watch(() => props.postId, async (newPostId) => {
  await getComment(newPostId);
});

const getComment = async (postId) => {
  openCommentForm.value = false;
  loading.value = true;
  try {
    comments.value = await getComments(postId);
  } catch {
    error.value = 'Unable to load comments';
  } finally {
    loading.value = false;
  }
};

const addComment = async (commentData) => {
  adding.value = true;
  try {
    const newComment = await addCommentToServer(commentData);
    comments.value.push(newComment);
    openCommentForm.value = false;
  } catch {
    error.value = 'Unable to add comment';
  } finally {
    adding.value = false
  }
};

const deleteComment = async (commentId) => {
  try {
    await deleteCommentFromServer(commentId);
    comments.value = comments.value.filter(({ id }) => id !== commentId);
  } catch {
    error.value = 'Unable to delete comment';
  }
};

const handleCloseForm = () => {
  openCommentForm.value = false;
};

const handleOpenCommentForm = () => {
  openCommentForm.value = true;
};

</script>

<template>
  <div class="block">
    <PostLoader v-if="loading" />

    <Message v-else-if="error" class="is-danger">
      <p>{{ error }}</p>
    </Message>

    <CommentForm v-else-if="openCommentForm" :btn-cls="adding" :post-id="postId" @close-form="handleCloseForm"
      @submit="addComment($event)" />

    <template v-else>
      <p v-if="!comments.length" class="title is-4">No comments yet</p>
      <CommentList v-else :comments="comments" @delete-comment="deleteComment($event)" />

      <button type="button" class="button is-link" @click="handleOpenCommentForm">
        Write a comment
      </button>
    </template>
  </div>
</template>
