<template>
  <div>
    <Loader v-if="loading" />
    <Notification v-if="error" :message="error" type="is-danger" />

    <p v-if="!comments.length && !loading">No comments yet</p>

    <div v-for="comment in comments" :key="comment.id" class="box">
      <p><strong>{{ comment.name }}</strong> ({{ comment.email }})</p>
      <p>{{ comment.body }}</p>
      <button class="button is-small is-danger" @click="deleteComment(comment)">Delete</button>
    </div>

    <CommentForm :postId="postId" @added="addComment" />
  </div>
</template>

<script>
import Loader from './Loader.vue';
import Notification from './Notification.vue';
import CommentForm from './CommentForm.vue';

export default {
  components: { Loader, Notification, CommentForm },
  props: { postId: Number },
  data() {
    return {
      comments: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchComments() {
      this.loading = true;
      try {
        const res = await fetch(`https://mate-academy.github.io/fe-students-api/comments?postId=${this.postId}`);
        if (!res.ok) throw new Error('Failed to load comments');
        this.comments = await res.json();
      } catch {
        this.error = 'Failed to load comments';
      } finally {
        this.loading = false;
      }
    },
    async deleteComment(comment) {
      const original = [...this.comments];
      this.comments = this.comments.filter(c => c.id !== comment.id);

      try {
        const res = await fetch(`https://mate-academy.github.io/fe-students-api/comments/${comment.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
      } catch (err) {
        this.comments = original;
        this.error = 'Failed to delete comment. Please retry.';
      }
    },
    addComment(comment) {
      this.comments.push(comment);
    }
  },
  mounted() {
    this.fetchComments();
  }
};
</script>
