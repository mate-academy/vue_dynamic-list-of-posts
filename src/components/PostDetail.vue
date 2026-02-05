<script lang="ts">
import type { Post } from '@/types/Posts.type';
import * as CommentApi from '../api/comments';
import type { Comment } from '@/types/Comments.type';
import CommentsTable from './CommentsTable.vue';
import AddCommentFrom from './AddCommentFrom.vue';
import Loader from './Loader.vue';

export default {
  name: 'PostDetail',

  components: {
    CommentsTable,
    AddCommentFrom,
    Loader,
  },

  watch: {
    'selectedPost.id': {
      immediate: true,
      handler() {
        this.fetchPosts();
      }
    }
  },

  props: {
    selectedPost: {
      type: Object as () => Post,
      required: true,
    },
  },

  data() {
    return {
      comments: [] as Comment[],
      errorMessage: '',
      isAddingComment: false,
      isLoading: false,
    }
  },

  mounted() {
    this.fetchPosts()
  },

  methods: {
    handleDelete() {
      this.$emit('deleted', this.selectedPost.id);
    },

    handleCommentCreated(payload: { name: string; email: string; body: string }) {
      const { name, email, body } = payload;

      this.isLoading = true;

      CommentApi.createComment(this.selectedPost.id, name, email, body)
        .then(() => {
          this.fetchPosts();
          this.isAddingComment = false;
          this.isLoading = false;
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },

    async handleDeleteComment(commentId: number) {
      if (!commentId) return;

      const prevComments = [...this.comments];

      this.comments = this.comments.filter(
        comment => comment.id !== commentId
      );

      try {
        await CommentApi.deleteComment(commentId);
      } catch {
        this.comments = prevComments;
        this.errorMessage = 'Failed to delete comment';
      }
    },


    async fetchPosts() {
      this.isLoading = true
      try {
        this.comments = await CommentApi.getAllCommentsByPostId(+this.selectedPost.id)
        this.isLoading = false
      } catch {
        this.errorMessage = 'Failed to load posts'
      }
    },
  }
}
</script>

<template>
  <div class="box post-detail post-detail-main-info">
    <div class="post-detail-header level mb-4">
      <h2 class="post-detail-title title is-4">
        #{{ selectedPost.id }}: {{ selectedPost.title }}
      </h2>

      <div class="button-wrapper level-right buttons">
        <button class="btn edit-btn button is-small is-info is-light" @click="$emit('edit')">
          <span class="icon"><i class="fas fa-edit"></i></span>
        </button>

        <button class="btn delete-btn button is-small is-danger is-light" @click="handleDelete">
          <span class="icon"><i class="fas fa-trash"></i></span>
        </button>
      </div>
    </div>

    <div class="content mb-5 post-detail-content">
      <p>{{ selectedPost.body }}</p>
    </div>
    <!-- ERROR MESSAGE -->
    <div v-if="errorMessage" class="notification is-danger is-light">
      <button class="delete" @click="errorMessage = ''"></button>
      {{ errorMessage }}
    </div>

    <Loader v-if="isLoading" />

    <div class="comments-wrapper block" v-else>
      <p v-if="comments.length === 0 && !isAddingComment" class="comments-wrapper-title title is-5 has-text-grey">
        No comments yet
      </p>

      <AddCommentFrom v-else-if="isAddingComment" @close="isAddingComment = false"
        @comment-created="handleCommentCreated" />

      <CommentsTable v-else :comments="comments" @deleted="handleDeleteComment" />
    </div>

    <button v-if="!isAddingComment && !isLoading" class="button button--primary is-fullwidth"
      :class="{ 'is-loading': isLoading }" @click="isAddingComment = true">
      Write Comment
    </button>
  </div>
</template>
