<script>
import { removeComment } from '../../api/comments';
export default {
  name: 'CommentList',
  props: {
    postComments: Array,
  },
  emits: ['loadComments'],
  methods: {
    deleteComment(commentId) {
      removeComment(commentId)
        .then(() => this.$emit('loadComments'));
    }
  }
}
</script>

<template>
  <article 
    className="message is-small" 
    v-for="comment of postComments"
    :key="comment.id"
  >
    <div className="message-header">
      <a :href="'mailto:' + comment.email"> {{ comment.name }} </a>
      <button 
        type="button" 
        className="delete is-small" 
        aria-label="delete"
        @click="() => deleteComment(comment.id)"
      >
        delete button
      </button>
    </div>
    <div className="message-body">{{ comment.body }}</div>
  </article>
</template>