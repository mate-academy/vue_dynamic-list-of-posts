<template>
  <div class="columns">
    <div class="column is-two-thirds">
      <section class="section">
        <h1 class="title">My Posts</h1>

        <Loader v-if="isLoading" />

        <div v-else-if="hasError" class="notification is-danger">
          Failed to load posts. Please try again.
        </div>

        <div v-else-if="!posts.length" class="notification is-info">
          No posts yet.
        </div>

        <PostsTable
          v-else
          :posts="posts"
          @open="openPost"
        />

        <div class="has-text-right">
          <button class="button is-primary mt-3" @click="openCreateForm">
            + Create new post
          </button>
        </div>
      </section>
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
import Loader from './components/Loader.vue';
import { get } from './api/api';

const posts = ref([]);
const isSidebarOpen = ref(false);
const isCreating = ref(false);
const selectedPost = ref(null);
const isLoading = ref(false);
const hasError = ref(false);

async function loadPosts() {
  isLoading.value = true;
  hasError.value = false;

  try {
    const data = await get('/posts?userId=1');
    posts.value = data;
  } catch (e) {
    console.error('Failed to load posts:', e);
    hasError.value = true;
  } finally {
    isLoading.value = false;
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
  selectedPost.value = updated;
}

function handlePostDeleted(id) {
  posts.value = posts.value.filter((p) => p.id !== id);
  if (selectedPost.value?.id === id) {
    selectedPost.value = null;
    isSidebarOpen.value = false;
  }
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
