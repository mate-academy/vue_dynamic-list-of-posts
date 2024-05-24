<template>
  <article class="message is-small" v-for="comment in comments" :key="comment.id">
    <div class="message-header">
      <a href="{{`mailto:${comment.email}`}}"> {{ comment.name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="deleteComment(comment.id)"
      >
        delete button
      </button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
<script>
import { removeComment } from '@/api/comments';

export default {
  name: 'CommentList',
  props: {
    comments: Array
  },
  methods: {
    deleteComment(commentId) {
      removeComment(commentId).then(() => this.$emit('comment-delete', commentId));
    }
  }
};
</script>
<style lang=""></style>
