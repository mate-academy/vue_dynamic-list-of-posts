<script>
import * as commentsApi from '../api/comments.js'
import CommentForm from './CommentForm.vue'
import Loader from './Loader.vue'

export default {
  components: { CommentForm, Loader },
  props: { post: Object },
  emits: ["delete", "open"],
  data() {
    return {
      comments: [],
      isCommentsLoading: false,
      isCommentFormOpened: false,
      commentsLoadError: "",       
      commentDeleteErrors: {},    
      commentAddError: "",        
    }
  },
  watch: {
    post: {
      immediate: true,
      handler(newPost) {
        if (newPost?.id) {
          this.fetchComments(newPost.id);
        }
      },
    },
  },
  methods: {
    deletePost() {
      this.$emit("delete", this.post.id);
    },
    editPost() {
      this.$emit("open");
    },
    toggleCommentForm() {
      this.isCommentFormOpened = !this.isCommentFormOpened;
    },

    async fetchComments(postId) {
      this.isCommentsLoading = true;
      this.commentsLoadError = "";
      try {
        const res = await commentsApi.getCommentsByPostId(postId);
        this.comments = res.data;
      } catch (err) {
        console.error(err);
        this.comments = [];
        this.commentsLoadError = "Failed to load comments. Please retry.";
      } finally {
        this.isCommentsLoading = false;
      }
    },

    async deleteComment(commentId) {
      // optimistic deletion
      const index = this.comments.findIndex(c => c.id === commentId);
      if (index === -1) return;

      const removedComment = this.comments.splice(index, 1)[0];
      this.commentDeleteErrors[commentId] = "";

      try {
        await commentsApi.deleteComment(commentId);
      } catch (err) {
        this.comments.splice(index, 0, removedComment);
        this.commentDeleteErrors[commentId] = "Failed to delete comment. Retry?";
      }
    },

    async retryDeleteComment(commentId) {
      await this.deleteComment(commentId);
    },

    async createComment(commentData) {
      this.commentAddError = "";
      try {
        const res = await commentsApi.createComment({
          name: commentData.name,
          email: commentData.email,
          body: commentData.body,
          postId: this.post.id,
        });

        this.comments.push(res.data);
        this.isCommentFormOpened = false;
      } catch (err) {
        console.error("Failed to add comment", err);
        this.commentAddError = "Failed to add comment. Retry?";
      }
    },

    retryAddComment(commentData) {
      this.createComment(commentData);
    },

    retryFetchComments() {
      if (this.post?.id) {
        this.fetchComments(this.post.id);
      }
    },
  },
};
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar Sidebar--open">
    <div class="tile is-child box is-success">
      <div class="content">
        <div class="block">
          <div class="is-flex is-justify-content-space-between is-align-items-center">
            <h2>{{ `#${post.id}: ${post.title}` }}</h2>
            <div class="is-flex">
              <span class="icon is-small is-right is-clickable" @click="editPost">
                <i class="fas fa-pen-to-square"></i>
              </span>
              <span class="icon is-small is-right has-text-danger is-clickable ml-3" @click="deletePost">
                <i class="fas fa-trash"></i>
              </span>
            </div>
          </div>
          <p data-cy="PostBody">{{ post.title }}</p>
        </div>

        <div class="block">

          <div v-if="commentsLoadError" class="notification is-danger">
            {{ commentsLoadError }}
            <button type="button" class="button is-light is-small ml-2" @click="retryFetchComments">Retry</button>
          </div>

          <p v-else-if="comments.length === 0 && !isCommentsLoading" class="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>

          <div v-else-if="isCommentsLoading" style="display: flex; justify-content: center;">
            <Loader />
          </div>

          <article v-else-if="!isCommentFormOpened" v-for="comment in comments" :key="comment.id" class="message is-small" data-cy="Comment">
            <div class="message-header">
              <a :href="`mailto:${comment.email}`" data-cy="CommentAuthor">{{ comment.name }}</a>
              <button
                data-cy="CommentDelete"
                type="button"
                class="delete is-small"
                aria-label="delete"
                @click="deleteComment(comment.id)"
              >
                delete
              </button>
            </div>
            <div class="message-body" data-cy="CommentBody">{{ comment.body }}</div>
            <div v-if="commentDeleteErrors[comment.id]" class="notification is-danger is-light mt-1">
              {{ commentDeleteErrors[comment.id] }}
              <button type="button" class="button is-light is-small ml-2" @click="retryDeleteComment(comment.id)">Retry</button>
            </div>
          </article>

          <CommentForm
            v-if="isCommentFormOpened"
            @close="toggleCommentForm"
            @add="createComment"
          />

          <div v-if="commentAddError" class="notification is-danger mt-2">
            {{ commentAddError }}
            <button type="button" class="button is-light is-small ml-2" @click="retryAddComment()">Retry</button>
          </div>

          <button
            v-if="!isCommentFormOpened"
            data-cy="WriteCommentButton"
            type="button"
            class="button is-link mt-2"
            @click="toggleCommentForm"
          >
            Write a comment
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>
