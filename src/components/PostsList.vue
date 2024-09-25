<script setup>
import { ref, onMounted } from 'vue'
import { getPostsByUserId, deletePost } from '@/api/posts'
import PostsItem from './PostsItem.vue'
import Loader from './Loader.vue'
import SideBar from './SideBar.vue'

const { userId } = defineProps({
  userId: Number
})

const posts = ref([])
const selectedPost = ref({})
const isLoading = ref(false)
const isError = ref(false)
const isSidebarOpen = ref(false)

onMounted(() => {
  isError.value = false
  isLoading.value = true
  getPostsByUserId(userId)
    .then(({ data }) => {
      posts.value = data
    })
    .catch(() => {
      isError.value = true
    })
    .finally(() => {
      isLoading.value = false
    })
})

const handleSelectPost = (post) => {
  selectedPost.value = post
  handleOpenSidebar()
}

const handeDeselectPost = () => {
  handleCloseSidebar()
  selectedPost.value = {}
}

const handleDeletePost = (postId) => {
  deletePost(postId).then(() => {
    posts.value = posts.value.filter((post) => post.id !== postId)

    handeDeselectPost()
  })
}

const handleOpenSidebar = () => {
  isSidebarOpen.value = true
}

const handleCloseSidebar = () => {
  isSidebarOpen.value = false
}
</script>
<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="handleOpenSidebar">
            Add New Post
          </button>
        </div>

        <Loader v-if="isLoading" />

        <div v-else-if="!isLoading && isError" class="notification is-danger">
          Failed to load posts. Please reload the page.
        </div>
        <div v-else-if="!isLoading && !isError && !posts.length" class="">No posts yet.</div>

        <table
          v-if="!isLoading && !isError && posts.length"
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
            <PostsItem
              v-for="post in posts"
              :key="post.id"
              :post
              :selectedPost
              @selectPost="handleSelectPost"
              @deselectPost="handeDeselectPost"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <SideBar :isSidebarOpen :selectedPost @deletePost="handleDeletePost" />
</template>
