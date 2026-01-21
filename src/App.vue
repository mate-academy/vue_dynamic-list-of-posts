<template>
  <div id="app">
    <LoginForm
      v-if="!currentUser"
      @login="handleLogin"
    />

    <template v-else>
      <Header :user="currentUser" @logout="handleLogout" />

      <section class="section">
        <div class="container">
          <div class="tile is-ancestor">
            <PostsList
              :posts="posts"
              :loading="postsLoading"
              :error="postsError"
              @create-post="openCreatePostForm"
              @open-post="openPost"
              @retry="loadPosts"
            />

            <Sidebar :is-open="sidebarOpen">
              <!-- Create/Edit Post Form -->
              <div v-if="showPostForm">
                <!-- Error notification for post form -->
                <div v-if="postFormError" class="notification is-danger">
                  <button class="delete" @click="postFormError = ''"></button>
                  {{ postFormError }}
                  <div class="buttons mt-3">
                    <button
                      class="button is-danger is-light"
                      @click="retryPostSubmit"
                      :disabled="postFormLoading"
                    >
                      <span class="icon">
                        <i class="fas fa-redo"></i>
                      </span>
                      <span>Retry</span>
                    </button>
                  </div>
                </div>

                <PostForm
                  :post="editingPost"
                  :loading="postFormLoading"
                  @submit="handlePostSubmit"
                  @cancel="closeSidebar"
                />
              </div>

              <!-- Post Details -->
              <template v-else-if="selectedPost">
                <!-- Error notification for post deletion -->
                <div v-if="postDeleteError" class="notification is-danger">
                  <button class="delete" @click="postDeleteError = ''"></button>
                  {{ postDeleteError }}
                  <div class="buttons mt-3">
                    <button
                      class="button is-danger is-light"
                      @click="retryDeletePost"
                    >
                      <span class="icon">
                        <i class="fas fa-redo"></i>
                      </span>
                      <span>Retry Delete</span>
                    </button>
                  </div>
                </div>

                <PostPreview
                  :post="selectedPost"
                  @edit="editPost"
                  @delete="deletePost"
                />

                <hr />

                <!-- Comments Section -->
                <div class="content">
                  <h3>Comments</h3>

                  <!-- Error notification for comment deletion -->
                  <div v-if="commentDeleteError" class="notification is-danger">
                    <button class="delete" @click="dismissCommentDeleteError"></button>
                    {{ commentDeleteError }}
                    <div class="buttons mt-3">
                      <button
                        class="button is-danger is-light"
                        @click="retryDeleteComment"
                      >
                        <span class="icon">
                          <i class="fas fa-redo"></i>
                        </span>
                        <span>Retry Delete</span>
                      </button>
                    </div>
                  </div>

                  <Loader v-if="commentsLoading" />

                  <div v-else-if="commentsError" class="notification is-danger">
                    {{ commentsError }}
                  </div>

                  <div v-else-if="comments.length === 0" class="block">
                    <p class="title is-4">No comments yet</p>
                  </div>

                  <div v-else>
                    <Comment
                      v-for="comment in comments"
                      :key="comment.id"
                      :comment="comment"
                      @delete="deleteComment"
                    />
                  </div>

                  <!-- Write Comment Button or Form -->
                  <button
                    v-if="!showCommentForm"
                    type="button"
                    class="button is-link mt-3"
                    @click="showCommentForm = true"
                  >
                    Write a comment
                  </button>

                  <div v-else>
                    <!-- Error notification for comment form -->
                    <div v-if="commentFormError" class="notification is-danger mt-3">
                      <button class="delete" @click="commentFormError = ''"></button>
                      {{ commentFormError }}
                      <div class="buttons mt-3">
                        <button
                          class="button is-danger is-light"
                          @click="retryCommentSubmit"
                          :disabled="commentFormLoading"
                        >
                          <span class="icon">
                            <i class="fas fa-redo"></i>
                          </span>
                          <span>Retry</span>
                        </button>
                      </div>
                    </div>

                    <CommentForm
                      ref="commentForm"
                      :loading="commentFormLoading"
                      @submit="handleCommentSubmit"
                    />
                  </div>
                </div>
              </template>
            </Sidebar>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import LoginForm from './components/LoginForm.vue'
import PostsList from './components/PostsList.vue'
import Sidebar from './components/Sidebar.vue'
import PostForm from './components/PostForm.vue'
import PostPreview from './components/PostPreview.vue'
import Comment from './components/Comment.vue'
import CommentForm from './components/CommentForm.vue'
import Loader from './components/Loader.vue'

import { getUserByEmail } from './services/users'
import { getPostsByUserId, createPost, updatePost, deletePost as deletePostAPI } from './services/posts'
import { getCommentsByPostId, createComment, deleteComment as deleteCommentAPI } from './services/comments'

export default {
  name: 'App',
  components: {
    Header,
    LoginForm,
    PostsList,
    Sidebar,
    PostForm,
    PostPreview,
    Comment,
    CommentForm,
    Loader
  },
  data() {
    return {
      currentUser: null,
      posts: [],
      postsLoading: false,
      postsError: '',
      selectedPost: null,
      editingPost: null,
      showPostForm: false,
      postFormLoading: false,
      postFormError: '',
      postDeleteError: '',
      comments: [],
      commentsLoading: false,
      commentsError: '',
      showCommentForm: false,
      commentFormLoading: false,
      commentFormError: '',
      commentDeleteError: '',
      sidebarOpen: false,
      // Store pending data for retry
      pendingPostData: null,
      pendingCommentData: null,
      pendingDeletePostId: null,
      pendingDeleteCommentId: null
    }
  },
  methods: {
    async handleLogin(email) {
      try {
        const user = await getUserByEmail(email)
        if (user) {
          this.currentUser = user
          await this.loadPosts()
        } else {
          alert('User not found. Please try another email.')
        }
      } catch (error) {
        alert('Failed to login. Please try again.')
      }
    },
    handleLogout() {
      this.currentUser = null
      this.posts = []
      this.closeSidebar()
    },
    async loadPosts() {
      if (!this.currentUser) return

      this.postsLoading = true
      this.postsError = ''

      try {
        this.posts = await getPostsByUserId(this.currentUser.id)
      } catch (error) {
        this.postsError = 'Failed to load posts'
      } finally {
        this.postsLoading = false
      }
    },
    openCreatePostForm() {
      this.showPostForm = true
      this.editingPost = null
      this.selectedPost = null
      this.showCommentForm = false
      this.sidebarOpen = true
    },
    async openPost(post) {
      this.selectedPost = post
      this.showPostForm = false
      this.editingPost = null
      this.showCommentForm = false
      this.sidebarOpen = true
      await this.loadComments(post.id)
    },
    editPost() {
      this.editingPost = { ...this.selectedPost }
      this.showPostForm = true
    },
    async handlePostSubmit(postData) {
      this.postFormLoading = true
      this.postFormError = ''
      this.pendingPostData = postData

      try {
        if (this.editingPost) {
          // Update existing post
          const updatedPost = await updatePost(this.editingPost.id, {
            ...postData,
            userId: this.currentUser.id
          })

          const index = this.posts.findIndex(p => p.id === this.editingPost.id)
          if (index !== -1) {
            this.posts[index] = updatedPost
          }

          this.selectedPost = updatedPost
          this.showPostForm = false
          this.editingPost = null
          this.pendingPostData = null
        } else {
          // Create new post
          const newPost = await createPost({
            ...postData,
            userId: this.currentUser.id
          })

          this.posts.push(newPost)
          this.selectedPost = newPost
          this.showPostForm = false
          this.pendingPostData = null
          await this.loadComments(newPost.id)
        }
      } catch (error) {
        this.postFormError = this.editingPost
          ? 'Failed to update post. Please try again.'
          : 'Failed to create post. Please try again.'
      } finally {
        this.postFormLoading = false
      }
    },
    retryPostSubmit() {
      if (this.pendingPostData) {
        this.handlePostSubmit(this.pendingPostData)
      }
    },
    async deletePost() {
      if (!confirm('Are you sure you want to delete this post?')) {
        return
      }

      this.pendingDeletePostId = this.selectedPost.id
      await this.performDeletePost(this.pendingDeletePostId)
    },
    async performDeletePost(postId) {
      this.postDeleteError = ''

      try {
        await deletePostAPI(postId)
        this.posts = this.posts.filter(p => p.id !== postId)
        this.pendingDeletePostId = null
        this.closeSidebar()
      } catch (error) {
        this.postDeleteError = 'Failed to delete post. Please try again.'
        // Keep the pendingDeletePostId so user can retry
      }
    },
    retryDeletePost() {
      if (this.pendingDeletePostId) {
        this.performDeletePost(this.pendingDeletePostId)
      }
    },
    async loadComments(postId) {
      this.commentsLoading = true
      this.commentsError = ''

      try {
        this.comments = await getCommentsByPostId(postId)
      } catch (error) {
        this.commentsError = 'Failed to load comments'
      } finally {
        this.commentsLoading = false
      }
    },
    async handleCommentSubmit(commentData) {
      this.commentFormLoading = true
      this.commentFormError = ''
      this.pendingCommentData = commentData

      try {
        const newComment = await createComment({
          ...commentData,
          postId: this.selectedPost.id
        })

        this.comments.push(newComment)
        this.pendingCommentData = null

        // Clear the comment body only after successful submission
        if (this.$refs.commentForm) {
          this.$refs.commentForm.clearBody()
        }
      } catch (error) {
        this.commentFormError = 'Failed to add comment. Please try again.'
      } finally {
        this.commentFormLoading = false
      }
    },
    retryCommentSubmit() {
      if (this.pendingCommentData) {
        this.handleCommentSubmit(this.pendingCommentData)
      }
    },
    async deleteComment(commentId) {
      // Optimistically remove comment for better UX
      const commentIndex = this.comments.findIndex(c => c.id === commentId)
      const deletedComment = this.comments[commentIndex]

      if (commentIndex !== -1) {
        this.comments.splice(commentIndex, 1)
      }

      this.commentDeleteError = ''
      this.pendingDeleteCommentId = commentId

      try {
        await deleteCommentAPI(commentId)
        this.pendingDeleteCommentId = null
      } catch (error) {
        // Restore comment if delete fails
        if (deletedComment) {
          this.comments.splice(commentIndex, 0, deletedComment)
        }
        this.commentDeleteError = 'Failed to delete comment. Please try again.'
        this.pendingDeleteCommentId = commentId
      }
    },
    retryDeleteComment() {
      if (this.pendingDeleteCommentId) {
        this.deleteComment(this.pendingDeleteCommentId)
      }
    },
    dismissCommentDeleteError() {
      this.commentDeleteError = ''
      this.pendingDeleteCommentId = null
    },
    closeSidebar() {
      this.sidebarOpen = false
      this.selectedPost = null
      this.editingPost = null
      this.showPostForm = false
      this.showCommentForm = false
      this.comments = []
      this.postFormError = ''
      this.postDeleteError = ''
      this.commentFormError = ''
      this.commentDeleteError = ''
      this.pendingPostData = null
      this.pendingCommentData = null
      this.pendingDeletePostId = null
      this.pendingDeleteCommentId = null
    }
  }
}
</script>
