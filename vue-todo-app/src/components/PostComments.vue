<script>
  import { getComments, deleteComment } from '../api/comments'
  import AddCommentForm from './AddCommentForm.vue'
  import PostLoader from './PostLoader.vue'

  export default {
    name: 'PostComments',
    components: {
      AddCommentForm,
      PostLoader,
    },
    props: {
      selectedPost: Object,
    },
    data() {
      return {
        comments: [],
        isFormActive: false,
        loading: false,
        errorMessage: '',
        deleteError: '',
      }
    },
    mounted() {
      this.loading = true
      getComments(this.selectedPost.id)
        .then(({ data }) => {
          this.comments = data
        })
        .catch(() => {
          this.errorMessage = "Can't download comments"
        })
        .finally(() => {
          this.loading = false
        })
    },
    watch: {
      selectedPost(newVal, oldVal) {
        if (newVal.id !== oldVal.id) {
          this.isFormActive = false
          this.loading = true

          getComments(this.selectedPost.id)
          .then(({ data }) => {
            this.comments = data
          })
          .catch(() => {
            this.errorMessage = "Can't download comments"
          })
          .finally(() => {
            this.loading = false;
          })
        }
      },
    },
    methods: {
      deleteComment(commentId) {
        this.deleteError = '';
        const commentIndex = this.comments.findIndex((com) => com.id === commentId);
        const deletedComment = this.comments[commentIndex];
        this.comments = this.comments.filter((com) => com.id !== commentId);

        deleteComment(commentId)
        .then(() => {
        })
        .catch(() => {
          this.deleteError = `Failed to delete comment #${commentId}. Please try again.`;
        });
      },
    },
  }
</script>

<template>
  <PostLoader v-if="loading" />

  <div v-else-if="!loading && errorMessage" class="is-error is-danger notification">
    {{ errorMessage }}
  </div>

  <div v-else-if="deleteError" class="notification is-danger is-light mb-4">
    {{ deleteError }}
  </div>

  <template v-else>
    <article v-for="comment of comments" :key="comment.id" class="message is-small">
      <div class="message-header">
        <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
        <button
          type="button"
          class="delete is-small"
          aria-label="delete"
          @click="deleteComment(comment.id)"
        ></button>
      </div>

      <div class="message-body">{{ comment.body }}</div>
    </article>

    <div v-if="!comments.length" class="block">
      <p class="title is-4">No comments yet</p>
    </div>

    <button
      v-if="!isFormActive "
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
</template>

<style></style>
