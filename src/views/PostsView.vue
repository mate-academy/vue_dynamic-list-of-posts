<template>
  <div v-if="user">
    <Header :user="user" @logout="handleLogout" />

    <div class="tile is-ancestor">
      <PostsList
        :posts="posts"
        :loading="postsLoading"
        :error="postsError"
        :selectedPostId="selectedPost ? selectedPost.id : null"
        @select-post="handleSelectPost"
        @add-new-post="handleAddNewPost"
      />

      <Sidebar :isOpen="isSidebarOpen">
        <template v-if="isSidebarOpen">
          <PostForm
            v-if="showPostForm"
            :userId="user.id"
            @created="handlePostCreated"
            @cancel="closeSidebar"
          />

          <PostDetails
            v-else-if="selectedPost"
            :post="selectedPost"
            @post-deleted="handlePostDeleted"
            @post-updated="handlePostUpdated"
          />
        </template>
      </Sidebar>
    </div>
  </div>
</template>

<script>
import Header from '../components/widgets/Header.vue'
import PostsList from '../components/widgets/PostsList.vue'
import PostForm from '../components/forms/PostForm.vue'
import PostDetails from '../components/widgets/PostDetails.vue'
import Sidebar from '../components/widgets/Sidebar.vue'
import { getUserPosts } from '../api/posts'
import { userStore, clearUser } from '../store/userStore'

export default {
  name: 'PostsView',
  components: { Header, PostsList, PostForm, PostDetails, Sidebar },
  data() {
    return {
      posts: [],
      postsLoading: false,
      postsError: false,
      selectedPost: null,
      showPostForm: false,
    }
  },
  computed: {
    user() {
      return userStore.user
    },
    isSidebarOpen() {
      return this.selectedPost !== null || this.showPostForm
    },
  },
  created() {
    if (!this.user) {
      this.$router.push('/')
      return
    }

    this.loadPosts()
  },
  methods: {
    async loadPosts() {
      this.postsLoading = true
      this.postsError = false

      try {
        this.posts = await getUserPosts(this.user.id)
      } catch (error) {
        this.postsError = true
      } finally {
        this.postsLoading = false
      }
    },

    handleSelectPost(post) {
      this.showPostForm = false
      this.selectedPost = post
    },

    handleAddNewPost() {
      this.selectedPost = null
      this.showPostForm = true
    },

    handlePostCreated(newPost) {
      this.posts.push(newPost)
      this.showPostForm = false
      this.selectedPost = newPost
    },

    handlePostDeleted(postId) {
      this.posts = this.posts.filter((p) => p.id !== postId)
      this.closeSidebar()
    },

    handlePostUpdated(updatedPost) {
      const index = this.posts.findIndex((p) => p.id === updatedPost.id)

      if (index !== -1) {
        this.posts.splice(index, 1, updatedPost)
      }

      this.selectedPost = updatedPost
    },

    closeSidebar() {
      this.selectedPost = null
      this.showPostForm = false
    },

    handleLogout() {
      clearUser()
      this.$router.push('/')
    },
  },
}
</script>
