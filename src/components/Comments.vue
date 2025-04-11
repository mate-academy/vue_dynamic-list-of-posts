<script>
import { deleteComment, getComments } from "../api/comments";
import AddCommentForm from "./AddCommentForm.vue";
import Loader from "./Loader.vue";
export default {
  name: "Comments",
  components: {
    Loader,
    AddCommentForm,
  },
  props: {
    selectedPost: Object,
  },
  data() {
    return {
      comments: [],
      loading: false,
      errorMessage: "",
      isFormActive: false,
    };
  },
  mounted() {
    this.loading = true;
    getComments(this.selectedPost.id)
      .then(({ data }) => {
        this.comments = data;
      })
      .catch(() => {
        this.errorMessage = "Can't download comments";
      })
      .finally(() => {
        this.loading = false;
      });
  },
  watch: {
    selectedPost(newVal, oldVal) {
      if (newVal.id !== oldVal.id) {
        this.isFormActive = false;
        this.loading = true;
        getComments(this.selectedPost.id)
          .then(({ data }) => {
            this.comments = data;
          })
          .catch(() => {
            this.errorMessage = "Can't download comments";
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
  methods: {
    deleteComment(commentId) {
      this.comments = this.comments.filter((com) => com.id !== commentId);
      deleteComment(commentId).then(() => {
        this.comments = this.comments.filter((com) => com.id !== commentId);
      });
    },
  },
};
</script>

<template>
  <Loader v-if="loading" />

  <div
    v-else-if="!loading && errorMessage"
    class="is-error is-danger notification"
  >
    {{ errorMessage }}
  </div>

  <template v-else>
    <article
      v-for="comment of comments"
      :key="comment.id"
      class="message is-small"
    >
      <div class="message-header">
        <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
        <button
          type="button"
          class="delete is-small"
          aria-label="delete"
          @click="deleteComment(comment.id)"
        />
      </div>
      <div class="message-body">{{ comment.body }}</div>
    </article>

    <div v-if="!comments.length" class="block">
      <p class="title is-4">No comments yet</p>
    </div>
  </template>

  <button
    v-if="!isFormActive"
    type="button"
    class="button is-link"
    @click="this.isFormActive = true"
  >
    Write a comment
  </button>

  <AddCommentForm
    v-else
    :postId="selectedPost.id"
    @closeCommentForm="this.isFormActive = false"
    @addComment="this.comments.push($event)"
  />
</template>

<style></style>