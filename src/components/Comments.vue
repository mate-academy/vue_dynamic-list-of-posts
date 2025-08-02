<script setup lang="ts">
import { ref, defineProps, onBeforeMount } from 'vue'
import { getCommentsByPostId, deleteComment } from '../api/comments.ts'
import type { Comment } from '../assets/types/types.ts'
import AddCommentForm from './AddCommentForm.vue';

const { postId } = defineProps(['postId']);

const isCommentForm = ref(false);
const comments = ref<Comment[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const closeCommentForm = () => {
  isCommentForm.value = false;
}
const openCommentForm = () => {
  isCommentForm.value = true;
}

const handleDelete = (id: number) => {
  deleteComment(id).then(() => {
    comments.value = comments.value.filter(comment => comment.id !== id);
  }).catch((error) => {
    console.error('Failed to delete comment:', error);
  });
}

const fetchComments = async () => {
  loading.value = true;
  try {
    const res = await getCommentsByPostId(+postId)
    comments.value = res.data || []
  } catch (error) {
    console.error('Failed to fetch comments', error)
    errorMessage.value = 'Failed to fetch comments';
  } finally {
    loading.value = false;
  }
}

onBeforeMount(fetchComments);

</script>
<template>
  <Loader v-if="loading" />

  <div v-else-if="!loading && errorMessage" class="is-error is-danger notification">
    {{ errorMessage }}
  </div>

  <template v-if="!loading && !isCommentForm">
    <article v-for="comment of comments" :key="comment.id" class="message is-small">
      <div class="message-header">
        <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
        <button
          type="button"
          class="delete is-small"
          aria-label="delete"
          @click="handleDelete(comment.id)"
        />
      </div>
      <div class="message-body">{{ comment.body }}</div>
    </article>

    <div v-if="!comments.length" class="block">
      <p class="title is-4">No comments yet</p>
    </div>
  </template>

  <button v-if="!isCommentForm"
    type="button"
    class="button is-link"
    @click="openCommentForm"
  >
    Write a comment
  </button>

  <AddCommentForm v-if="isCommentForm"
    :postId="postId"
    @closeCommentForm="closeCommentForm"
    @addComment="comments.push($event)"
  />
</template>
