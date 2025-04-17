<script>
import CommentForm from './CommentForm.vue';
import Comment from './Comment.vue';
import Loader from './Loader.vue';
import { getCommentsByPostId, addComment, deleteComment } from '../api/comments';
export default {
  name: 'PostPreview',
  components: { CommentForm, Comment, Loader },
  props: { 
    post: {
      type: Object,
      required: true,
    },
  },
  emits: ['deletePost', 'editPost'],
  data() {
    return {
      showCommentForm: false,
      comments: [],
      loading: false,
    };
  },
  mounted() {
    this.fetchComments();
  },
  watch: {
    'post.id': {
      handler: 'fetchComments',
      immediate: true,
    },
  },
  methods: {
    async fetchComments() {
      if (!this.post.id) return; // Ensure postId is present before fetching
      try {
        this.loading = true;
        const res = await getCommentsByPostId(this.post.id);
        this.comments = res.data;
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        this.loading = false;
      }
    },
    async handleCreateComment(commentData) {
      try {
        const res = await addComment({ ...commentData, postId: this.post.id });
        this.comments.push(res.data);
        this.toggleCommentForm();
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    },
    async handleDeleteComment(commentId) {
      const index = this.comments.findIndex(comment => comment.id === commentId);
      if (index === -1) return;
      const [removedComment] = this.comments.splice(index, 1);
      try {
        await deleteComment(commentId);
      } catch (error) {
        this.comments.splice(index, 0, removedComment); // Revert on failure
        console.error('Failed to delete comment:', error);
      }
    },
    toggleCommentForm() {
      this.showCommentForm = !this.showCommentForm;
    },
  },
};
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-clickable" @click="$emit('editPost')">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small has-text-danger is-clickable ml-3"
          @click="$emit('deletePost', post.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>

    <p data-cy="PostBody">{{ post.body }}</p>

    <div v-if="loading" class="is-flex is-justify-content-center">
      <Loader />
    </div>

    <template v-else>
      <div v-if="comments.length">
        <Comment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @remove-comment="handleDeleteComment"
        />
      </div>
      <div class="block">
        <p v-if="!comments.length" class="title is-4">No comments yet</p>
        <button class="button is-link" @click="toggleCommentForm">
          {{ showCommentForm ? 'Cancel' : 'Write a comment' }}
        </button>
      </div>

      <CommentForm
        v-if="showCommentForm"
        :postId="post.id"
        @toggle-form="toggleCommentForm"
        @create-comment="handleCreateComment"
      />
    </template>
  </div>
</template>
