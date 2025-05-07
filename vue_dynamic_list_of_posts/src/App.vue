<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainHeader from './components/MainHeader.vue'
import PostsList from './components/PostsList.vue'
import UserLogin from './components/UserLogin.vue'
import AddPostForm from './components/AddPostForm.vue'
import PostBody from './components/PostBody.vue'
import type { Post } from './types/Post'

const isAuth = ref(false)
const showLogin = ref(false)
const showAddPostForm = ref(false)
const userPosts = ref(JSON.parse(localStorage.getItem('posts') || '[]'))
const selectedPost = ref<{ id: number; title: string; body: string } | null>(
  null,
)
const isPostEditing = ref(false)

onMounted(() => {
  const isUserAuth = localStorage.getItem('email') || ''

  if (isUserAuth !== '') {
    showLogin.value = false
  }
})

const handleAuthStatus = (authStatus: boolean) => {
  isAuth.value = authStatus
  showLogin.value = !isAuth.value
}

const openAddPostForm = () => {
  showAddPostForm.value = true
  selectedPost.value = null
}

const closeAddPostForm = () => {
  showAddPostForm.value = false
}
const addNewPost = (post: { id: number; title: string; body: string }) => {
  userPosts.value = [...userPosts.value, post]

  selectedPost.value = post
  showAddPostForm.value = false

  localStorage.setItem('posts', JSON.stringify(userPosts.value))
}

const togglePost = (post: { id: number; title: string; body: string }) => {
  if (selectedPost.value === null || selectedPost.value?.id !== post.id) {
    selectedPost.value = post
  } else {
    selectedPost.value = null
  }

  showAddPostForm.value = false;
}

const deletePost = (id: number) => {
  userPosts.value = userPosts.value.filter((post: Post) => post.id !== id)
  localStorage.setItem('posts', JSON.stringify(userPosts.value))
  selectedPost.value = null
}

const updatePost = (updatedPost: {
  id: number
  title: string
  body: string
}) => {
  const index = userPosts.value.findIndex(
    (post: Post) => post.id === updatedPost.id,
  )
  if (index !== -1) {
    userPosts.value[index] = updatedPost
    localStorage.setItem('posts', JSON.stringify(userPosts.value))
    selectedPost.value = updatedPost
  }
}
</script>

<template>
  <UserLogin v-if="showLogin" @authStatus="handleAuthStatus" />

  <div v-else>
    <MainHeader @authStatus="handleAuthStatus" />
    <div class="is-flex full-width flex-gap">
      <PostsList
        class="flex-item"
        @openAddPostForm="openAddPostForm"
        :posts="userPosts"
        :showAddPostForm="showAddPostForm"
        :selectedPost="selectedPost"
        @togglePost="togglePost"
        :isPostEditing="isPostEditing"
      />

      <transition name="slide">
        <AddPostForm
          class="flex-item"
          v-if="showAddPostForm && selectedPost === null"
          @addPost="addNewPost"
          @closePostForm="closeAddPostForm"
        />
      </transition>

      <transition name="slide">
        <PostBody
          :post="selectedPost"
          v-if="selectedPost !== null"
          class="flex-item"
          @deletePost="deletePost"
          @updatePost="updatePost"
          v-model:isPostEditing="isPostEditing"
        />
      </transition>
    </div>
  </div>
</template>

<style>
.full-width {
  --container-width: 1200px;
  max-width: var(--container-width);
  margin: 0 auto;
  margin-top: 40px;
}

.flex-item {
  width: 100%;
}

.flex-gap {
  gap: 1.5rem;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from, .slide-leave-from {
  transform: translateX(50%);
}

.slide-enter-to, .slide-leave-from {
  transform: translateX(0);
}
</style>
