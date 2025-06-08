<script>
export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  emits: ['deleteComment'],
};
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <template v-if="comment.email">
        <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
      </template>
      <template v-else>
        <span>{{ comment.name }}</span>
      </template>

      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        title="Delete comment"
        @click="$emit('deleteComment', comment.id)"
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

<style></style>
