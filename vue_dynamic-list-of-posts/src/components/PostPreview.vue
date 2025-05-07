<script>
import CommentForm from "./CommentForm.vue";
import Comment from "./Comment.vue";
import Loader from "./Loader.vue";
import { getPostComments, addCommentPost, deleteComment } from '../api/comments';

export default {
  name: 'PostPreview',
  components: {
    CommentForm,
    Comment,
    Loader,
  },
  props: {
    post: Object,
  },
  emits: ['deletePost', 'editPost'],
  data() {
    return {
      showCommentForm: false,
      comments: [],
      loading: false,
    }
  },
  mounted() {
    this.loadComments();
  },
  watch: {
    post: {
      handler(newValue, oldValue) {
        if (newValue.id !== oldValue.id) {
          this.loadComments();
        }
      },
      deep: true,
    }
  },
  methods: {
    toggleCommentForm() {
      this.showCommentForm = !this.showCommentForm;
    },
    loadComments() {
      this.loading = true;
      getPostComments(this.post.id)
      .then((res) => {
        this.comments = res.data;
      })
      .finally(() => {
        this.loading = false;
      })
    },
    createComment(data) {
      addCommentPost({...data, postId: this.post.id})
        .then((res) => {
          this.comments.push(res.data);
        });
    },
    removeComment(commentId) {
      const indexToRemove = this.comments.findIndex(comment => comment.id === commentId);

      if (indexToRemove === -1) {
        return;
      }

      const commentToRemove = this.comments[indexToRemove];
      this.comments.splice(indexToRemove, 1);

      deleteComment(commentId)
        .then((res) => {
          console.log('success', res.data);
        })
        .catch((error) => {
          this.comments.splice(indexToRemove, 0, commentToRemove);
          console.error('Failed to delete comment:', error);
        });
    },
  }
}
</script>

<template>
    <div class="block">
      <div class="is-flex is-justify-content-space-between is-align-items-center">
        <h2>#{{ post.id }}: {{ post.title }}</h2>
        <div class="is-flex">
          <span class="icon is-small is-right is-clickable" @click="this.$emit('editPost')">
            <i class="fas fa-pen-to-square"></i>
          </span>
          <span class="icon is-small is-right has-text-danger is-clickable ml-3" @click="this.$emit('deletePost', post.id)">
            <i class="fas fa-trash"></i>
          </span>
        </div>
      </div>
      <p data-cy="PostBody">{{ post.body }}</p>
    </div>
    <div v-if="loading" class="is-flex is-justify-content-center">
      <Loader />
    </div>
    <template v-else> 
      <div v-show="!showCommentForm">
        <Comment
          v-for="comment in this.comments"
          :key="comment.id"
          :comment="comment"
          @remove-comment="removeComment"
        />
        <div class="block">
          <p v-if="!this.comments.length" class="title is-4">No comments yet</p>
          <button type="button" class="button is-link" @click="toggleCommentForm">Write a comment</button>
        </div>
      </div>
        <CommentForm
          v-show="showCommentForm"
          @toggle-form="toggleCommentForm"
          :post-id="post.id"
          @create-comment="createComment"
        />
    </template>
</template>