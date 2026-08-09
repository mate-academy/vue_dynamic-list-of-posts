<template>
  <div class="block">
    <div
      v-if="isLoading"
      class="notification is-info"
    >
      Loading comments...
    </div>

    <div
      v-else-if="error"
      class="notification is-danger"
    >
      Failed to load comments
    </div>

    <div
      v-else-if="comments.length === 0"
      class="block"
    >
      <p class="title is-4">
        No comments yet
      </p>
    </div>

    <div v-else>
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="message is-small"
      >
        <div class="message-header">
          <a :href="`mailto:${comment.email}`">
            {{ comment.name }}
          </a>

          <button
            type="button"
            class="delete is-small"
            aria-label="delete"
            @click="deleteComment(comment)"
          ></button>
        </div>

        <div class="message-body">
          {{ comment.body }}
        </div>
      </article>
    </div>

    <WriteComment
      v-if="showForm"
      ref="writeComment"
      :is-submitting="isSubmitting"
      @submit="handleCreateComment"
    />

    <button
      v-else
      type="button"
      class="button is-link"
      @click="showForm = true"
    >
      Write a comment
    </button>
  </div>
</template>

<script>
import {
  getComments,
  deleteComment as deleteCommentApi,
  createComment,
} from '../services/api';

import WriteComment from './WriteComment.vue';

export default {
  name: 'Comments',

  components: {
    WriteComment,
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
      isLoading: true,
      error: false,
      showForm: false,
      isSubmitting: false,
    };
  },

  async mounted() {
    try {
      this.comments = await getComments(this.postId);
    } catch (error) {
      this.error = true;
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    async deleteComment(comment) {
      this.comments = this.comments.filter(
        currentComment => currentComment.id !== comment.id,
      );

      try {
        await deleteCommentApi(comment.id);
      } catch (error) {
        console.error(error);
      }
    },

    async handleCreateComment(comment) {
      this.isSubmitting = true;

      try {
        const newComment = await createComment({
          ...comment,
          postId: this.postId,
        });

        this.comments.push(newComment);

        this.$refs.writeComment.clearComment();

        this.showForm = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
