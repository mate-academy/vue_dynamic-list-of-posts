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
              <PostForm
                v-if="showPostForm"
                :post="editingPost"
                :loading="postFormLoading"
                @submit="handlePostSubmit"
                @cancel="closeSidebar"
              />

              <!-- Post Details -->
              <template v-else-if="selectedPost">
                <PostPreview
                  :post="selectedPost"
                  @edit="editPost"
                  @delete="deletePost"
                />

                <hr />

                <!-- Comments Section -->
                <div class="content">
                  <h3>Comments</h3>

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

                  <CommentForm
                    v-else
                    :loading="commentFormLoading"
                    @submit="handleCommentSubmit"
                  />
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
      comments: [],
      commentsLoading: false,
      commentsError: '',
      showCommentForm: false,
      commentFormLoading: false,
      sidebarOpen: false
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
        } else {
          // Create new post
          const newPost = await createPost({
            ...postData,
            userId: this.currentUser.id
          })

          this.posts.push(newPost)
          this.selectedPost = newPost
          this.showPostForm = false
          await this.loadComments(newPost.id)
        }
      } catch (error) {
        alert('Failed to save post. Please try again.')
      } finally {
        this.postFormLoading = false
      }
    },
    async deletePost() {
      if (!confirm('Are you sure you want to delete this post?')) {
        return
      }

      try {
        await deletePostAPI(this.selectedPost.id)
        this.posts = this.posts.filter(p => p.id !== this.selectedPost.id)
        this.closeSidebar()
      } catch (error) {
        alert('Failed to delete post. Please try again.')
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

      try {
        const newComment = await createComment({
          ...commentData,
          postId: this.selectedPost.id
        })

        this.comments.push(newComment)
      } catch (error) {
        alert('Failed to add comment. Please try again.')
      } finally {
        this.commentFormLoading = false
      }
    },
    async deleteComment(commentId) {
      // Optimistically remove comment for better UX
      const commentIndex = this.comments.findIndex(c => c.id === commentId)
      const deletedComment = this.comments[commentIndex]

      if (commentIndex !== -1) {
        this.comments.splice(commentIndex, 1)
      }

      try {
        await deleteCommentAPI(commentId)
      } catch (error) {
        // Restore comment if delete fails
        if (deletedComment) {
          this.comments.splice(commentIndex, 0, deletedComment)
        }
        alert('Failed to delete comment. Please try again.')
      }
    },
    closeSidebar() {
      this.sidebarOpen = false
      this.selectedPost = null
      this.editingPost = null
      this.showPostForm = false
      this.showCommentForm = false
      this.comments = []
    }
  }
}
</script>
