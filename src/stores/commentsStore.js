import { defineStore } from 'pinia';
import {
  getCommentsOfPosts,
  addNewComment,
  deleteComment,
} from '../api/comments';

export const useCommentStore = defineStore('comment', {
  state: () => ({
    commentsList: [],
    isCommentsListLoading: false,
    errorMessages: {
      fetch: null,
      name: null,
      email: null,
      body: null,
    },
    newComment: {
      name: '',
      email: '',
      body: '',
    },
    editingComment: null,
    isCommentFormVisible: false,
  }),

  actions: {
    async loadComments(postId) {
      this.isCommentsListLoading = true;
      this.errorMessages.fetch = null;
      try {
        this.commentsList = await getCommentsOfPosts(postId);
      } catch (err) {
        this.errorMessages.fetch = 'Error fetching comments: ' + err.message;
      } finally {
        this.isCommentsListLoading = false;
      }
    },

    async addComment(postId) {
      const { name, email, body } = this.newComment;
      const newComment = { postId, name, email, body };
      try {
        const addedComment = await addNewComment(newComment);
        this.commentsList.push(addedComment);
        this.newComment = { name: '', email: '', body: '' };
        this.isCommentFormVisible = false;
      } catch (err) {
        this.errorMessages.fetch = 'Error adding comment: ' + err.message;
      }
    },

    startEditing(comment) {
      this.editingComment = { ...comment };
    },

    async deleteComment(id) {
      try {
        await deleteComment(id);
        this.commentsList = this.commentsList.filter(c => c.id !== id);
      } catch (err) {
        this.errorMessages.fetch = 'Error deleting comment: ' + err.message;
      }
    },
    clearEditing() {
      this.editingComment = null;
    },

    toggleCommentForm() {
      this.isCommentFormVisible = !this.isCommentFormVisible;
      if (!this.isCommentFormVisible) {
        this.errorMessages.fetch = null;
      }
    },
  },
});
