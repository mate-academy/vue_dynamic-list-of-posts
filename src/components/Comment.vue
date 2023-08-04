<script>
import { removeComment } from '../api/comment';

  export default {
    name: 'Comment',
    props: {
      comment: Object,
    },
    methods: {
      async remove(id) {
        await removeComment(id);
        this.$emit('update-comments');
      }
    },
    emits: ['update-comments'],
  }
</script>

<template>
  <article className="message is-small">
    <div className="message-header">
      <a
        :href="`mailto:${comment.email}`"
      >
        {{ comment.name }}
      </a>

      <button
        type="button"
        className="delete is-small"
        aria-label="delete"
        @click="remove(comment.id)"
      >
      </button>
    </div>

    <div className="message-body">{{ comment.message }}</div>
  </article>
</template>
