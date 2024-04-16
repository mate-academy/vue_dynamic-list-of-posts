<script>
export default {
  name: 'Comment',
  props: {
    comment: Object,
  },
  emits: ['removeComment']
}
</script>

<template>
  <article className="message is-small">
  <div className="message-header">
    <a href="{`mailto:${email}`}"> {{ comment.name }} </a>
    <button 
      type="button" 
      className="delete is-small" 
      aria-label="delete"
      @click="this.$emit('removeComment', comment.id)"
    >
      delete button
    </button>
  </div>
  <div className="message-body">{{ comment.body }}</div>
</article>
</template>