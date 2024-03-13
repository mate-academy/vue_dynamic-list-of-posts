<script>

  export default {
    inject: ['removeComment'],

    props: {
      comment: Object,
    },
  }
</script>

<template>
  <div className="message-header">
    <a href="{`mailto:${email}`}">{{ comment.name }}</a>
    <button 
      type="button" 
      className="delete is-small" 
      aria-label="delete"
      @click="removeComment(comment.id)"
    >
      delete button
    </button>
  </div>
  <div className="message-body">{{ comment.body }}</div>
</template>
