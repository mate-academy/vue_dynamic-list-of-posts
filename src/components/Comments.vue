<script setup>
import { deleteComment, getCommentsByPostId } from '@/api/comments';
import { onBeforeMount, ref, defineProps } from 'vue';
import AddCommentForm from './AddCommentForm.vue';
import Loader from '../loader/Loader.vue';

const { postId } = defineProps(['postId']);

const isCommentForm = ref(false);
const comments = ref([]);
const loading = ref(false);
const errorMessage = ref('');

const closeCommentForm = () => {
  isCommentForm.value = false;
}

const openCommentForm = () => {
  isCommentForm.value = true;
}

const handleDelete = (id) => {
  deleteComment(id).then(() => {
    comments.value = comments.value.filter(comment => comment.id !== id);
  }).catch((error) => {
    console.error('Failed to delete comment:', error);
    errorMessage.value = 'Failed to delete comment';
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

  <div
    v-else-if="!loading && errorMessage"
    class="is-error is-danger notification"
  >
    {{ errorMessage }}
  </div>

  <template v-if="!loading && !isCommentForm">
    <article
      v-for="comment of comments"
      :key="comment.id"
      class="message is-small"
    >
      <div class="message-header">
        <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
        <button
          type="button"
          class="delete is-small"
          aria-label="delete"
          @click="handleDelete(comment.id)"
        ></button>
      </div>
      <div class="message-body">{{ comment.body }}</div>
    </article>

    <div v-if="!comments.length" class="block">
      <p class="title is-4">No comments yet</p>
    </div>
  </template>

  <button
    v-if="!isCommentForm"
    type="button"
    class="button is-link"
    @click="openCommentForm"
  >
    Write a comment
  </button>

  <AddCommentForm
    v-if="isCommentForm"
    :postId="postId"
    @closeCommentForm="closeCommentForm"
    @addComment="comments.push($event)"
  />
</template>
