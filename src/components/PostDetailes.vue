<script>
import { addComment, deleteComment, deletePost, getComments } from '../api/api';
import Loader from './Loader.vue';

export default {
  name: 'PostDetailes',
  components: {
    Loader,
  },
  props: {
    post: Object,
  },
  emits: ['post-deleted', 'edit-post'],

  data() {
    return {
      comments: [],
      isLoadingComments: false,
      isCommentFormVisible: false,
      newComment: {
        name: '',
        email: '',
        body: '',
      },
      isSubmittingComment: false,
    };
  },
  watch: {
    post: {
      immediate: true,
      handler(newPost) {
        if (newPost) {
          this.loadComments();
          this.isCommentFormVisible = false;
          this.resetCommentForm();
        }
      },
    },
  },
  methods: {
    async loadComments() {
      this.isLoadingComments = true;
      await new Promise((resolve) => setTimeout(resolve, 300));
      try {
        const { data } = await getComments(this.post.id);
        this.comments = data;
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        this.isLoadingComments = false;
      }
    },
    async deleteCurrentPost() {
      try {
        await deletePost(this.post.id);
        this.$emit('post-deleted', this.post.id);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    },
    editPost() {
      this.$emit('edit-post');
    },
    openCommentForm() {
      this.isCommentFormVisible = true;
    },
    resetCommentForm() {
      this.newComment = { name: '', email: '', body: '' };
    },
    async submitComment() {
      if (
        !this.newComment.name.trim() ||
        !this.newComment.email.trim() ||
        !this.newComment.body.trim()
      ) {
        alert('Please fill in all fields.');
        return;
      }
      this.isSubmittingComment = true;
      try {
        await addComment(
          this.post.id,
          this.newComment.name,
          this.newComment.email,
          this.newComment.body
        );
        await this.loadComments();
        this.isCommentFormVisible = false;
        this.resetCommentForm();
      } catch (error) {
        console.error('Failed to add comment:', error);
      } finally {
        this.isSubmittingComment = false;
      }
    },

    async deleteCurrentComment(commentId) {
      try {
        await deleteComment(commentId);
        await this.loadComments();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    },
    cancelComment() {
      this.isCommentFormVisible = false;
      this.resetCommentForm();
    },
  },
};
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ `#${post.id}: ${post.title}` }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="editPost">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="deleteCurrentPost"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>
  </div>
  <div
    v-if="isLoadingComments"
    class="is-flex is-justify-content-center is-align-items-center mt-2"
  >
    <Loader />
  </div>
  <article
    class="message is-small"
    v-else-if="comments.length > 0"
    v-for="comment of comments"
    :key="comment.id"
  >
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="deleteCurrentComment(comment.id)"
      >
        delete button
      </button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
  <div class="block" v-else>
    <p class="title is-4">No comments yet</p>
  </div>

  <button
    type="button"
    class="button is-link"
    @click="openCommentForm"
    v-if="!isCommentFormVisible"
  >
    Write a comment
  </button>

  <div v-if="isCommentFormVisible" class="content mt-3">
    <form @submit.prevent="submitComment">
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name">Author Name</label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            id="comment-author-name"
            v-model="newComment.name"
            placeholder="Name Surname"
            class="input"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            v-model="newComment.email"
            placeholder="Your email"
            class="input"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body">Write Post Body</label>
        <div class="control">
          <textarea
            id="comment-body"
            v-model="newComment.body"
            placeholder="Comment"
            class="textarea"
          ></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isSubmittingComment }"
          >
            Add Comment
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="cancelComment"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
