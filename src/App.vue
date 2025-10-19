<template>
  <div class="columns">
    <div class="column is-two-thirds">
      <PostsTable
        :posts="posts"
        @open="openPost"
        @create="openCreateForm"
        @reload="loadPosts"
      />
    </div>

    <div class="column sidebar" :class="{ 'Sidebar--open': isSidebarOpen }">
      <Sidebar
        v-if="isSidebarOpen"
        :selectedPost="selectedPost"
        :isCreating="isCreating"
        @close="closeSidebar"
        @postCreated="handlePostCreated"
        @postUpdated="handlePostUpdated"
        @postDeleted="handlePostDeleted"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PostsTable from './components/PostsTable.vue';
import Sidebar from './components/Sidebar.vue';
import { get } from './api/api';

const posts = ref([]);
const isSidebarOpen = ref(false);
const isCreating = ref(false);
const selectedPost = ref(null);

async function loadPosts() {
  try {
    // show posts of current user (userId=1)
    const data = await get('/posts?userId=1');
    posts.value = data;
  } catch (e) {
    console.error('Failed to load posts:', e);
  }
}

onMounted(loadPosts);

function openPost(post) {
  selectedPost.value = post;
  isCreating.value = false;
  isSidebarOpen.value = true;
}

function openCreateForm() {
  selectedPost.value = null;
  isCreating.value = true;
  isSidebarOpen.value = true;
}

function closeSidebar() {
  isSidebarOpen.value = false;
}

function handlePostCreated(newPost) {
  posts.value.unshift(newPost);
  selectedPost.value = newPost;
  isCreating.value = false;
  isSidebarOpen.value = true;
}

function handlePostUpdated(updated) {
  const idx = posts.value.findIndex((p) => p.id === updated.id);
  if (idx !== -1) posts.value[idx] = updated;
}

function handlePostDeleted(id) {
  posts.value = posts.value.filter((p) => p.id !== id);
}
</script>

<style>
.sidebar {
  border-left: 1px solid #ccc;
  min-height: 100vh;
  transition: all 0.3s;
}
.Sidebar--open {
  background: #fafafa;
}
</style>
