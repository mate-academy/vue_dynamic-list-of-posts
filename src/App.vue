<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Sidebar from './components/Sidebar/PostSidebar.vue'
import AddPost from './components/AddPost/AddPost.vue'
import PostHeader from './components/Header/PostHeader.vue'
import Loader from './components/Loader/DataLoader.vue'
import Login from './components/Login/LogIn.vue'
import PostList from './components/PostList/PostList.vue'
import PostPreview from './components/PostPreview/PostPreview.vue'
import { getPostsByUser, deletePost } from './api/posts'
import type { Post, User } from './api/posts'

export default defineComponent({
  components: {
    Sidebar,
    AddPost,
    PostHeader,
    Loader,
    Login,
    PostList,
    PostPreview,
  },

  setup() {
    const stored = localStorage.getItem('user')
    const currentUser = ref<User | null>(stored ? JSON.parse(stored) : null)

    const posts = ref<Post[]>([])
    const isLoadingPosts = ref(false)
    const postsError = ref(false)

    const selectedPost = ref<Post | null>(null)
    const isNewPostMode = ref(false)
    const isEditMode = ref(false)
    const isSidebarOpen = ref(false)

    async function loadPosts(userId: number) {
      isLoadingPosts.value = true
      postsError.value = false
      try {
        posts.value = await getPostsByUser(userId)
      } catch {
        postsError.value = true
      } finally {
        isLoadingPosts.value = false
      }
    }

    onMounted(() => {
      if (currentUser.value) loadPosts(currentUser.value.id)
    })

    function handleLogin(user: User) {
      currentUser.value = user
      localStorage.setItem('user', JSON.stringify(user))
      loadPosts(user.id)
    }

    function handleLogout() {
      currentUser.value = null
      localStorage.removeItem('user')
      posts.value = []
      selectedPost.value = null
      isSidebarOpen.value = false
    }

    function handleSelectPost(post: Post) {
      if (selectedPost.value?.id === post.id) {
        selectedPost.value = null
        isSidebarOpen.value = false
        return
      }
      selectedPost.value = post
      isNewPostMode.value = false
      isEditMode.value = false
      isSidebarOpen.value = true
    }

    function handleAddNewPost() {
      selectedPost.value = null
      isNewPostMode.value = true
      isEditMode.value = false
      isSidebarOpen.value = true
    }

    function handleEditPost() {
      isEditMode.value = true
      isNewPostMode.value = false
    }

    async function handleDeletePost(postId: number) {
      try {
        await deletePost(postId)
        posts.value = posts.value.filter((p) => p.id !== postId)
        selectedPost.value = null
        isSidebarOpen.value = false
      } catch {
        alert('Failed to delete post. Please try again.')
      }
    }

    function handlePostCreated(newPost: Post) {
      posts.value.push(newPost)
      selectedPost.value = newPost
      isNewPostMode.value = false
      isSidebarOpen.value = true
    }

    function handlePostUpdated(updatedPost: Post) {
      posts.value = posts.value.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      selectedPost.value = updatedPost
      isEditMode.value = false
    }

    function handleCancelSidebar() {
      isNewPostMode.value = false
      isEditMode.value = false
      if (!selectedPost.value) isSidebarOpen.value = false
    }

    return {
      currentUser,
      posts,
      isLoadingPosts,
      postsError,
      selectedPost,
      isNewPostMode,
      isEditMode,
      isSidebarOpen,
      handleLogin,
      handleLogout,
      handleSelectPost,
      handleAddNewPost,
      handleEditPost,
      handleDeletePost,
      handlePostCreated,
      handlePostUpdated,
      handleCancelSidebar,
    }
  },
})
</script>

<template>
  <PostHeader :user="currentUser" @logout="handleLogout" />

  <Login v-if="!currentUser" @login="handleLogin" />

  <main v-else class="section">
    <div class="container">
      <div class="columns is-align-items-stretch">
        <div class="column">
          <PostList
            :posts="posts"
            :is-loading="isLoadingPosts"
            :has-error="postsError"
            :selected-post-id="selectedPost?.id ?? null"
            @select-post="handleSelectPost"
            @add-new-post="handleAddNewPost"
          />
        </div>

        <Sidebar :class="{ 'Sidebar--open': isSidebarOpen }">
          <Loader v-if="isLoadingPosts" />

          <AddPost
            v-else-if="isNewPostMode"
            title="New Post"
            :user-id="currentUser!.id"
            @post-created="handlePostCreated"
            @cancel="handleCancelSidebar"
          />

          <AddPost
            v-else-if="isEditMode && selectedPost"
            title="Edit Post"
            :post="selectedPost"
            :user-id="currentUser!.id"
            @post-updated="handlePostUpdated"
            @cancel="handleCancelSidebar"
          />

          <PostPreview
            v-else-if="selectedPost"
            :post="selectedPost"
            @edit="handleEditPost"
            @delete="handleDeletePost"
          />
        </Sidebar>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
