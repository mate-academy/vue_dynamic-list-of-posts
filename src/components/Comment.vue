<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: 'Comment',
  props: {
    comment: Object,
  },
  emits: ['deleteComment'],
}
</script>

<template>
  <article className="message is-small">
    <div className="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button type="button" className="delete is-small" aria-label="delete" @click="this.$emit('deleteComment', comment.id)"></button>
    </div>
    <div className="message-body">{{ comment.body }}</div>
  </article>
</template>
