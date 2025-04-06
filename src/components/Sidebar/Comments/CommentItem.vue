<script>
export default {
  name: 'CommentItem',
  props: {
    comment: Object,
  },
  methods: {
    deleteComment(commentId) {
      this.$store.dispatch('comments/deleteComment', commentId)
    },
  },
}
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto: ${comment.email}`"> {{ comment.name }} </a>
      <button
        type="button"
        @click="deleteComment(comment.id)"
        class="delete is-small"
        aria-label="delete"
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
