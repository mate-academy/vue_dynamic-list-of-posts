import { defineStore } from "pinia";
import { createComment, deleteComment, getComments } from "@/api/comments";

export const useCommentsStore = defineStore('comment', {
  state: () => ({
    comments: [],
    author: {
      name: '',
      email: '',
    },
    isLoadingComments: false,
    isShowCommentForm: false,
  }),
  actions: {
    showCommentForm() {
      this.isShowCommentForm = true;
    },
    notShowCommentForm() {
      this.isShowCommentForm = false;
    },
    setComments(comments) {
      this.comments = comments;
    },
    addComment(comment) {
      this.comments.push(comment)
    },
    setAuthor(name, email) {
      this.author.name = name;
      this.author.email = email;
    },
    async createNewComment(newComment) {
      try {
        const response = await createComment(newComment);
        this.addComment(response.data);
        this.setAuthor(newComment.name, newComment.email);
        return true;
      } catch (error) {
        console.error('Error adding comment:', error);
        throw new Error('Failed to add comment. Please try again')
      }
    },
    async removeComment(commentId) {
      const index = this.comments.findIndex(comment => comment.id === commentId);

      const [deletedComment] = this.comments.splice(index, 1);

      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error('Failed to delete comment on server:', error);
        this.comments.splice(index, 0, deletedComment);
      }
    },
    async fetchComments(postId) {
      if (!postId) return;

      this.isLoadingComments = true;
      try {
        const { data } = await getComments(postId);
        this.setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        this.isLoadingComments = false;
      }
    }
  }
})