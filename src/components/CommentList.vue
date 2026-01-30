<script>
import { deleteComment, getComments } from "@/api/comments";
import Comment from "./Comment.vue";
import Loader from "./Loader.vue";
import Notification from "./Notification.vue";
import AddComment from "./AddComment.vue";

export default {
  name: "CommentList",
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  components: {
    Comment,
    Loader,
    Notification,
    AddComment,
  },
  data() {
    return {
      comments: [],
      isLoading: false,
      wantAddComment: false,
      errorMessage: "",
    };
  },
  methods: {
    clearForm() {
      this.wantAddComment = false;
      this.errorMessage = "";
    },
    loadComments() {
      this.errorMessage = "";
      this.isLoading = true;
      this.comments = [];

      getComments(this.postId)
        .then((data) => {
          this.comments = data;
        })
        .catch(() => {
          this.errorMessage = "Unable to load comments";
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    addComment(newComment) {
      this.comments.push(newComment);
      this.clearForm();
    },
    deleteComment(commentId) {
      this.errorMessage = "";

      this.comments = this.comments.filter(
        (comment) => comment.id !== commentId,
      );

      deleteComment(commentId)
        .then(() => {
          this.clearForm();
        })
        .catch(() => (this.errorMessage = "Unable to delete comment"));
    },
    clearError() {
      this.errorMessage = '';
    },
  },
  watch: {
    postId() {
      this.loadComments();
      this.wantAddComment = false;
    },
  },
  mounted() {
    this.loadComments();
  },
};
</script>

<template>
  <div class="block">
    <Loader v-if="isLoading" />
    <Notification
      v-if="errorMessage"
      :errorMessage="errorMessage"
      @close="clearError"
    />
    <template v-if="!isLoading">
      <div v-if="comments.length === 0 && !errorMessage" class="block">
        <p class="title is-4">No comments yet</p>
      </div>
      <Comment
        v-for="comment of comments"
        :key="comment.id"
        :comment="comment"
        @delete="deleteComment"
      />
      <AddComment
        v-if="wantAddComment"
        :postId="postId"
        @clear="clearForm"
        @success="addComment"
      />
    </template>
    <button
      v-if="this.wantAddComment === false"
      type="button"
      class="button is-link"
      @click="this.wantAddComment = true"
    >
      Write a comment
    </button>
  </div>
</template>
