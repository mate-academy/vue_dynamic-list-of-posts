<script setup>
defineProps({
  comments: Array,
  deleteCommentHandler: Function,
});
</script>
<template>
  <article
    class="message is-small"
    v-for="comment in comments"
    :key="comment.id"
  >
    <div class="message-header">
      <a href="{`mailto:${comment.email}`}"> {{ comment.name }} </a>
      <button
        @click="deleteCommentHandler(comment.id)"
        type="button"
        class="delete is-small"
        aria-label="delete"
      >
        delete button
      </button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
