<script>
import { addComment, deleteComment, getComments } from '@/api/comments'
import AddComment from './AddComment.vue'
import Loader from './Loader.vue'

export default {
  name: 'CommentsList',
  components: {
    AddComment,
    Loader,
  },
  data() {
    return {
      comments: [],
      isWritingComment: false,
      isLoading: false,
    }
  },
  props: {
    post: Object,
  },
  mounted() {
    this.fetchComments()
  },
  watch: {
    'post.id': function () {
      this.fetchComments()
    },
  },
  methods: {
    fetchComments() {
      if (!this.post?.id) return

      this.isLoading = true
      getComments(this.post.id)
        .then(({ data }) => {
          this.comments = data
        })
        .catch(() => {
          this.errorMessage = 'Unable to load comments'
        })
        .finally(() => (this.isLoading = false))
    },
    deleteComment(commentId) {
      deleteComment(commentId)
        .then(() => {
          this.comments = this.comments.filter((comment) => comment.id !== commentId)
        })
        .catch(() => {
          this.errorMessage = 'Unable to delete comment'
        })
      this.comments = this.comments.filter((comment) => comment.id !== commentId)
    },
    addComment(comment) {
      addComment(comment)
        .then(({ data }) => {
          this.comments = [...this.comments, data]
          this.isWritingComment = false
        })
        .catch(() => {
          this.errorMessage = 'Unable to add comment'
        })
    },
    handleClose() {
      console.log('close')
      this.isWritingComment = false
      console.log(this.isWritingComment)
    },
  },
}
</script>
<template>
  <Loader v-if="isLoading" />
  <div class="block">
    <div v-if="comments.length === 0 && !isLoading" class="block">
      <p class="title is-4">No comments yet</p>
    </div>
    <template v-if="comments.length > 0 && !isWritingComment && !isLoading">
      <article v-for="comment in comments" :key="comment.id" class="message is-small">
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
    </template>
    <button
      v-if="!isWritingComment"
      type="button"
      class="button is-link"
      @click="isWritingComment = true"
    >
      Write a comment
    </button>
    <AddComment
      v-else
      :post="post"
      :close="handleClose"
      :handleAdd="addComment"
      :isWrited="isWritingComment"
    />
  </div>
</template>
