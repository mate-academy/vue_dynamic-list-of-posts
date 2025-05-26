<script setup>
import { useCommentStore } from '../../stores/commentsStore';

const commentStore = useCommentStore();

async function handleDeleteComment(id) {
  try {
    await commentStore.deleteComment(id);
  } catch (err) {
    commentStore.errorMessages.fetch = 'Error deleting comment: ' + err.message;
  }
}
</script>
<template>
  <article
    class="message is-small"
    v-for="comment in commentStore.commentsList"
    :key="comment.id"
  >
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="handleDeleteComment(comment.id)"
      >
        x
      </button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
