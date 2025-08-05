<script setup lang="ts">
import { ref, onBeforeMount, defineProps } from 'vue'
import { getPostsByUserId } from '../api/posts.js'
import Loader from './Loader.vue'
import Sidebar from './Sidebar.vue'
import type { Post } from '../assets/types/types.ts'

// Получаем userId от родителя
const { userId } = defineProps(['userId'])

const posts = ref<Post[]>([])
const loading = ref(false)
const isActiveSidebar = ref(false)
const selectedPost = ref<Post | null>(null)

const closeSidebar = () => {
  isActiveSidebar.value = false
}

const openSidebar = () => {
  isActiveSidebar.value = true
}

const handleAddNewPost = () => {
  selectedPost.value = null
  openSidebar()
}

const fetchPosts = async () => {
  loading.value = true
  try {
    const res = await getPostsByUserId(+userId)
    posts.value = res.data || []
  } catch (error) {
    console.error('Failed to fetch posts', error)
  } finally {
    loading.value = false
  }
}

const openPost = (post: Post) => {
  if (selectedPost.value?.id === post.id) {
    // При повторном клике на тот же пост — закрываем
    closeSidebar()
    selectedPost.value = null
  } else {
    selectedPost.value = post
    openSidebar()
  }
}

const addPost = (newPost: Post) => {
  posts.value.push(newPost)
}

const updatePost = (newPost: Post) => {
  posts.value = posts.value.map((post) => (post.id === newPost.id ? newPost : post))
}

const deletePost = (postId: number) => {
  posts.value = posts.value.filter((post) => post.id !== postId)
}

onBeforeMount(fetchPosts)
</script>

<template>
  <div
    class="tile is-parent mr-6 ml-6 mt-6 flex"
    :class="{ 'is-align-items-center mt-2 is-flex is-justify-content-center': loading }"
  >
    <Loader v-if="loading" />

    <div v-else class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="handleAddNewPost">
            Add New Post
          </button>
        </div>

        <table
          v-if="posts && posts.length > 0"
          class="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button type="button" @click="openPost(post)" class="button is-link">
                  {{ isActiveSidebar && selectedPost?.id === post.id ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <h1 v-else class="has-text-centered is-size-5">No posts yet</h1>
      </div>
    </div>

    <Sidebar
      :isActiveSidebar="isActiveSidebar"
      :selectedPost="selectedPost"
      :userId="userId"
      @addPost="addPost"
      @deletePost="deletePost"
      @closeSidebar="closeSidebar"
      @updatePost="updatePost"
    />
  </div>
</template>

<style scoped>
.flex {
  display: flex;
  gap: 24px;
}

.flex > div {
  flex: 1;
  box-sizing: border-box;
}
</style>
