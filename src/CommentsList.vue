<template>
  <section>
    <div v-if="loading" class="has-text-centered">
      <Loader />
    </div>
    <div v-else-if="error" class="notification is-danger">
      {{ error }}
    </div>
    <div v-else-if="comments.length === 0" class="notification is-info">
      No comments yet
    </div>
    <div v-else>
      <ul>
        <li v-for="comment in comments" :key="comment.id" class="box">
          <strong>{{ comment.name }}</strong>
          <span>({{ comment.email }})</span>
          <p>{{ comment.body }}</p>
          <button
            class="button is-small is-danger"
            @click="handleDelete(comment)"
          >
            Delete
          </button>
        </li>
      </ul>
      <WriteCommentBtn v-if="!showForm" @click="showForm = true" />
      <CommentForm
        v-if="showForm"
        :postId="postId"
        @submitted="handleAddComment"
        @cancel="showForm = false"
      />
    </div>
  </section>
</template>

<script>
import Loader from "./Loader.vue";
import WriteCommentBtn from "./WriteCommentBtn.vue";
import CommentForm from "./CommentForm.vue";
import { fetchComments, deleteComment } from "./api.js";
export default {
  name: "CommentsList",
  components: { Loader, WriteCommentBtn, CommentForm },
  props: {
    postId: Number,
  },
  data() {
    return {
      comments: [],
      loading: false,
      error: "",
      showForm: false,
    };
  },
  created() {
    this.loadComments();
  },
  methods: {
    async loadComments() {
      this.loading = true;
      this.error = "";
      try {
        this.comments = await fetchComments(this.postId);
      } catch (err) {
        this.error = err.message || "Failed to load comments";
      } finally {
        this.loading = false;
      }
    },
    async handleDelete(comment) {
      // Optimistically remove comment
      const oldComments = [...this.comments];
      this.comments = this.comments.filter((c) => c.id !== comment.id);
      try {
        await deleteComment(comment.id);
      } catch (err) {
        this.error = err.message || "Failed to delete comment";
        // Allow retry: restore comment and show error
        this.comments = oldComments;
      }
    },
    handleAddComment(newComment) {
      this.comments.push({
        id: newComment.id,
        name: newComment.name,
        email: newComment.email,
        body: newComment.body,
      });
      this.showForm = false;
      this.error = "";
    },
  },
};
</script>
