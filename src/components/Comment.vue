<script>
export default {
  name: "Comment",
  props: {
    comment: Object,
    deleteComment: Function,
  },
};
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a href="{`mailto:${email}`}"> name </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="deleteComment(comment.id)"
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
