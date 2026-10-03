<script>
import { deleteComment, getComments } from '../api/comments.js';
import Comment from './Comment.vue';
import CommentForm from './CommentForm.vue';
import Loader from './Loader.vue';
import Notification from './Notification.vue';

export default {
  name: 'CommentsList',
  components: {
    Comment,
    CommentForm,
    Loader,
    Notification,
  },
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      isLoading: false,
      isFormVisible: false,
      errorMessage: '',
      pendingDelete: null,
    };
  },
  watch: {
    postId: {
      immediate: true,
      handler() {
        this.isFormVisible = false;
        this.loadComments();
      },
    },
  },
  methods: {
    async loadComments() {
      const requestedPostId = this.postId;
      this.isLoading = true;
      this.errorMessage = '';
      this.comments = [];
      this.pendingDelete = null;

      try {
        const data = await getComments(requestedPostId);

        if (requestedPostId === this.postId) {
          this.comments = data;
        }
      } catch {
        if (requestedPostId === this.postId) {
          this.errorMessage = 'Unable to load comments';
        }
      } finally {
        if (requestedPostId === this.postId) {
          this.isLoading = false;
        }
      }
    },
    addComment(newComment) {
      this.comments.push(newComment);
    },
    async removeComment(commentId) {
      const index = this.comments.findIndex((comment) => comment.id === commentId);

      if (index === -1) {
        return;
      }

      const [removedComment] = this.comments.splice(index, 1);
      this.errorMessage = '';
      this.pendingDelete = null;

      try {
        await deleteComment(commentId);
      } catch {
        this.comments.splice(index, 0, removedComment);
        this.pendingDelete = { comment: removedComment };
        this.errorMessage = 'Unable to delete comment';
      }
    },
    async retryDelete() {
      if (!this.pendingDelete) {
        return;
      }

      const { comment } = this.pendingDelete;
      this.pendingDelete = null;
      this.comments = this.comments.filter((item) => item.id !== comment.id);

      try {
        await deleteComment(comment.id);
        this.errorMessage = '';
      } catch {
        this.comments.unshift(comment);
        this.pendingDelete = { comment };
        this.errorMessage = 'Unable to delete comment';
      }
    },
    closeError() {
      this.errorMessage = '';
      this.pendingDelete = null;
    },
  },
};
</script>

<template>
  <div class="block">
    <Loader v-if="isLoading" />

    <Notification
      v-if="errorMessage"
      :message="errorMessage"
      @close="closeError"
    />

    <button
      v-if="pendingDelete"
      type="button"
      class="button is-warning is-small retry-button"
      @click="retryDelete"
    >
      Retry delete
    </button>

    <template v-if="!isLoading && !errorMessage">
      <div v-if="comments.length === 0" class="block">
        <p class="title is-4">No comments yet</p>
      </div>

      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @delete="removeComment"
      />
    </template>

    <div v-if="!isLoading && errorMessage === 'Unable to load comments'" class="block">
      <button type="button" class="button is-link is-light" @click="loadComments">
        Retry loading comments
      </button>
    </div>

    <CommentForm
      v-if="isFormVisible && !isLoading"
      :post-id="postId"
      @success="addComment"
    />

    <button
      v-if="!isFormVisible"
      type="button"
      class="button is-link"
      @click="isFormVisible = true"
    >
      Write a comment
    </button>
  </div>
</template>
