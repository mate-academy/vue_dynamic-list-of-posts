<template>
  <div>
    <div v-if="!isEditing" class="block">
      <div class="is-flex is-justify-content-space-between is-align-items-center">
        <h2>#{{ post.id }}: {{ post.title }}</h2>
        <div class="is-flex">
          <span class="icon is-small is-right is-clickable" @click="isEditing = true">
            <i class="fas fa-pen-to-square"></i>
          </span>
          <span
            class="icon is-small is-right has-text-danger is-clickable ml-3"
            @click="handleDelete"
          >
            <i class="fas fa-trash"></i>
          </span>
        </div>
      </div>
      <p data-cy="PostBody">{{ post.body }}</p>
    </div>

    <PostForm
      v-else
      :userId="post.userId"
      :post="post"
      @updated="handleUpdated"
      @cancel="isEditing = false"
    />

    <hr />

    <div v-if="!isEditing">
      <div
        v-if="commentsLoading"
        class="is-flex is-justify-content-center is-align-items-center mt-2"
      >
        <Loader />
      </div>

      <div v-else-if="commentsError" class="notification is-danger">
        Something went wrong while loading comments!
        <button class="button is-small ml-3" @click="loadComments">Retry</button>
      </div>

      <div v-else-if="comments.length === 0" class="block">
        <p class="title is-4">No comments yet</p>
      </div>

      <div v-else>
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @delete="handleDeleteComment"
        />
      </div>

      <div class="mt-4">
        <button
          v-if="!showCommentForm"
          type="button"
          class="button is-link"
          @click="showCommentForm = true"
        >
          Write a comment
        </button>

        <NewCommentForm v-else :postId="post.id" @created="handleCommentCreated" />
      </div>
    </div>
  </div>
</template>

<script>
import Loader from './../ui/Loader.vue'
import CommentItem from './CommentItem.vue'
import NewCommentForm from './../forms/NewCommentForm.vue'
import PostForm from './../forms/PostForm.vue'
import { getPostComments, deleteComment } from '../../api/comments'
import { deletePost } from '../../api/posts'

export default {
  name: 'PostDetails',
  components: { Loader, CommentItem, NewCommentForm, PostForm },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  emits: ['post-deleted', 'post-updated'],
  data() {
    return {
      comments: [],
      commentsLoading: false,
      commentsError: false,
      showCommentForm: false,
      isEditing: false,
    }
  },
  watch: {
    'post.id': {
      handler() {
        this.loadComments()
        this.showCommentForm = false
        this.isEditing = false
      },
      immediate: true,
    },
  },
  methods: {
    async loadComments() {
      this.commentsLoading = true
      this.commentsError = false

      try {
        this.comments = await getPostComments(this.post.id)
      } catch (error) {
        this.commentsError = true
      } finally {
        this.commentsLoading = false
      }
    },

    async handleDeleteComment(commentId) {
      const deletedComment = this.comments.find((c) => c.id === commentId)
      this.comments = this.comments.filter((c) => c.id !== commentId)

      try {
        await deleteComment(commentId)
      } catch (error) {
        if (deletedComment) {
          this.comments.push(deletedComment)
          this.comments.sort((a, b) => a.id - b.id)
        }
      }
    },

    handleCommentCreated(comment) {
      this.comments.push(comment)
    },

    async handleDelete() {
      try {
        await deletePost(this.post.id)
        this.$emit('post-deleted', this.post.id)
      } catch (error) {
        alert('Failed to delete post. Please try again.')
      }
    },

    handleUpdated(updatedPost) {
      this.isEditing = false
      this.$emit('post-updated', updatedPost)
    },
  },
}
</script>
