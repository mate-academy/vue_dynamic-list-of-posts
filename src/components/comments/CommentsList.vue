<template>
  <section>
    <Loader v-if="isLoading" />

    <div v-else-if="hasError" class="notification is-danger">
      Failed to load comments. Please try again.
    </div>

    <div v-else-if="!comments.length" class="notification is-info">
      No comments yet.
    </div>

    <div v-else>
      <div v-for="comment in comments" :key="comment.id" class="box">
        <p class="is-size-6 has-text-weight-semibold">
          {{ comment.name }}
          <span class="has-text-grey-light">({{ comment.email }})</span>
        </p>
        <p>{{ comment.body }}</p>
        <button
          class="button is-small is-danger is-light mt-2"
          @click="deleteComment(comment.id)"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="has-text-right mt-4">
      <button
        v-if="!isFormVisible"
        class="button is-primary"
        @click="isFormVisible = true"
      >
        Write a comment
      </button>

      <CommentForm v-else @submit="addComment" @cancel="isFormVisible = false" />
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import { get } from '../../api/api';
import Loader from '../Loader.vue';
import CommentForm from './CommentForm.vue';

const props = defineProps({
  postId: Number,
});

const comments = ref([]);
const isLoading = ref(false);
const hasError = ref(false);
const isFormVisible = ref(false);

watch(
  () => props.postId,
  async (newId) => {
    if (!newId) return;
    await loadComments(newId);
  },
  { immediate: true }
);

async function loadComments(postId) {
  isLoading.value = true;
  hasError.value = false;
  comments.value = [];

  try {
    const data = await get(`/comments?postId=${postId}`);
    comments.value = data;
  } catch {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}

function addComment(newComment) {
  comments.value.push(newComment);
  isFormVisible.value = false;
}

function deleteComment(id) {
  comments.value = comments.value.filter((c) => c.id !== id);
}
</script>
