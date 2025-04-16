<script>
  export default {
    name: 'comment',
    props: {
      comment: {},
    },
    emits: ['deleteComment']
  }
</script>

<template>
  <article className="message is-small">
    <div className="message-header">
      <a :href="'mailto:' + comment.email">{{ comment.name }}</a>
      <button type="button" className="delete is-small" aria-label="delete" @click="$emit('deleteComment', comment.id)">
        delete button
      </button>
    </div>
    <div className="message-body">{{ comment.body }}</div>
  </article>
</template>
