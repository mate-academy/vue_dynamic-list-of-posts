<template>
  <div>
    <AppHeader v-if="currentUser" :user="currentUser" @logout="handleLogout" />

    <LoginForm v-if="!currentUser" @login="handleLogin" />

    <section v-else class="section">
      <div class="container">
        <div class="tile is-ancestor">

          <PostsList
            :posts="posts"
            :loading="postsLoading"
            :error="postsError"
            :selected-post-id="selectedPost?.id ?? null"
            @new-post="openNewPost"
            @select-post="togglePost"
            @reload="loadPosts"
          />

          <Sidebar
            :is-open="sidebarOpen"
            :mode="sidebarMode"
            :post="selectedPost"
            :user-id="currentUser.id"
            @close="closeSidebar"
            @post-created="handlePostCreated"
            @post-updated="handlePostUpdated"
            @post-deleted="handlePostDeleted"
          />

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import LoginForm from './components/LoginForm.vue'
import PostsList from './components/PostsList.vue'
import Sidebar from './components/Sidebar.vue'
import { postsApi } from './api/index.js'

const currentUser = ref(null)
const posts = ref([])
const postsLoading = ref(false)
const postsError = ref(false)
const selectedPost = ref(null)
const sidebarOpen = ref(false)
const sidebarMode = ref('view')

function handleLogin(user) {
  currentUser.value = user
}

function handleLogout() {
  currentUser.value = null
  posts.value = []
  selectedPost.value = null
  sidebarOpen.value = false
}

watch(currentUser, (user) => {
  if (user) loadPosts()
})

async function loadPosts() {
  postsLoading.value = true
  postsError.value = false
  try {
    posts.value = await postsApi.getByUser(currentUser.value.id)
  } catch {
    postsError.value = true
  } finally {
    postsLoading.value = false
  }
}

function togglePost(post) {
  if (selectedPost.value?.id === post.id) {
    closeSidebar()
  } else {
    selectedPost.value = post
    sidebarMode.value = 'view'
    sidebarOpen.value = true
  }
}

function openNewPost() {
  selectedPost.value = null
  sidebarMode.value = 'new'
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
  selectedPost.value = null
  sidebarMode.value = 'view'
}

function handlePostCreated(post) {
  posts.value.push(post)
  selectedPost.value = post
  sidebarMode.value = 'view'
}

function handlePostUpdated(updated) {
  const idx = posts.value.findIndex(p => p.id === updated.id)
  if (idx !== -1) posts.value[idx] = updated
  selectedPost.value = updated
}

function handlePostDeleted(id) {
  posts.value = posts.value.filter(p => p.id !== id)
  closeSidebar()
}
</script>
