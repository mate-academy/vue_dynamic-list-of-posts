<script>
  export default {
    name: 'CommentComponent',
    emits: ['delete'],
    props: {
      comment: Object,
    },
    methods: {
      handlerDeleteComment(commentId) {
        this.$emit('delete', commentId);
      },
    },
  }
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
      <button 
        type="button" 
        class="delete is-small" 
        aria-label="delete"
        @click="handlerDeleteComment(comment.id)"
      >
        delete button
      </button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>