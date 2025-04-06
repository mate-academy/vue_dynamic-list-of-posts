<!-- eslint-disable vue/multi-word-component-names -->
<script>
import { createComment, getCommentsByPostId, removeComment } from '@/api/comments'
import AddPost from './AddPost.vue'
import Comment from './Comment.vue'
import PostPreview from './PostPreview.vue'
import Loader from './Loader.vue'
import CommentForm from './CommentForm.vue'

export default {
  name: 'Sidebar',
  components: {
    AddPost,
    PostPreview,
    Comment,
    Loader,
    CommentForm,
  },
  props: {
    isActive: Boolean,
    selectedPost: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['deletePost', 'closeSidebar', 'createPost', 'updatePost'],
  data() {
    return {
      hasUpdateForm: false,
      comments: [],
      isLoadingComments: false,
      isCommentForm: false,
      errorMessage: '',
    }
  },
  methods: {
    handleCreateComment(commentData) {
      const postId = this.selectedPost.id
      createComment({ ...commentData, postId })
        .then(({ data }) => {
          this.comments.push(data)
          this.isCommentForm = false
        })
        .catch(() => {
          this.errorMessage = 'Something went wrong with creating comment!'
        })
    },
    handleDeleteComment(commentId) {
      removeComment(commentId)
        .then(() => {
          this.comments = this.comments.filter((comment) => comment.id !== commentId)
        })
        .catch(() => {
          this.errorMessage = 'Something went wrong with deleting comment!'
        })
    },
    handleCloseForm() {
      if (Object.keys(this.selectedPost).includes('id')) {
        this.hasUpdateForm = false
        return
      }

      this.$emit('closeSidebar')
    },
    handleCloseCommentForm() {
      this.isCommentForm = false
      this.errorMessage = ''
    },
  },
  watch: {
    selectedPost: {
      handler(newPost) {
        this.hasUpdateForm = false

        if (!newPost || !newPost.id) {
          this.comments = []
          return
        }

        this.isLoadingComments = true

        getCommentsByPostId(newPost.id)
          .then(({ data }) => {
            this.comments = data
          })
          .catch(() => {
            this.errorMessage = 'Something went wrong!'
          })
          .finally(() => {
            this.isLoadingComments = false
          })
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<template>
  <div class="tile is-parent Sidebar" :class="{ 'Sidebar--open': isActive }">
    <div class="tile is-child box is-success">
      <div class="tile is-child box is-success">
        <div class="content">
          <template v-if="selectedPost.hasOwnProperty('id') && hasUpdateForm === false">
            <PostPreview
              :selectedPost="selectedPost"
              @deletePost="this.$emit('deletePost', $event)"
              @updatePost="hasUpdateForm = true"
            />

            <template v-if="!isCommentForm">
              <div
                class="is-flex is-justify-content-center is-align-items-center mt-2"
                v-if="isLoadingComments"
              >
                <Loader />
              </div>

              <div className="block" v-else-if="!isLoadingComments && comments.length === 0">
                <p className="title is-4">No comments yet</p>
              </div>

              <template v-else>
                <Comment
                  v-for="comment of comments"
                  :key="comment.id"
                  :comment="comment"
                  @delete-comment="handleDeleteComment"
                />
              </template>

              <button
                type="button"
                className="button is-link"
                @click="isCommentForm = true"
              >
                Write a comment
              </button>


              <div class="block error-message" v-if="!isLoadingComments && errorMessage">
                <p >{{ errorMessage }}</p>
              </div>
            </template>
            <CommentForm
              v-else
              @create-comment="handleCreateComment"
              @close-form="handleCloseCommentForm"
              :error="errorMessage"
            />
          </template>

          <AddPost
            v-else
            :selectedPost="selectedPost"
            @closeForm="handleCloseForm"
            @createPost="this.$emit('createPost', $event)"
            @updatePost="this.$emit('updatePost', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
