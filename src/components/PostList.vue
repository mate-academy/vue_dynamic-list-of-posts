<script setup>
import { ref, onMounted, watch } from 'vue';
import * as postsApi from '@/api/posts';
import Loader from './Loader.vue';
import AddPostForm from './AddPostForm.vue';
import Sidebar from './Sidebar.vue';
import PostPreview from './PostPreview.vue';
import { getUserId } from '@/utils/user';

const posts = ref([]);
const errorMessage = ref(null);
const isLoading = ref(true);
const isSidebarOpen = ref(false);
const selectedPost = ref(null);
const isEditing = ref(false);
const userId = getUserId();

onMounted(async () => {
  try {
    posts.value = await postsApi.getPosts(userId);
  } catch (err) {
    errorMessage.value = 'Failed to load posts';
  } finally {
    isLoading.value = false;
  }
});

watch(selectedPost, (newSelectedPostId, prevSelectedPostId) => {
  if (newSelectedPostId?.id !== prevSelectedPostId?.id && isEditing.value) {
    isEditing.value = false;
  }
});

const openSideBar = () => {
  isSidebarOpen.value = true;
  selectedPost.value = null;
  isEditing.value = false;
};

const addNewPost = newPost => {
  const index = posts.value.findIndex(post => post.id === newPost.id);

  if (index !== -1) {
    posts.value[index] = newPost;
  } else {
    posts.value.push(newPost);
  }

  isEditing.value = false;
  selectedPost.value = newPost;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  selectedPost.value = null;
  isEditing.value = false;
};

const previewSelectedPost = post => {
  if (selectedPost.value?.id === post.id) {
    closeSidebar();
  } else {
    isSidebarOpen.value = true;
    selectedPost.value = post;
  }
};

const handlePostEditing = post => {
  isEditing.value = true;
  selectedPost.value = { ...post };
};

const handlePostDelete = postId => {
  posts.value = posts.value.filter(post => post.id !== postId);
  closeSidebar();
};
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            :class="{
              'is-light': isSidebarOpen && !selectedPost,
            }"
            @click="openSideBar"
          >
            Add New Post
          </button>
        </div>

        <div v-if="errorMessage" class="has-text-centered">
          <p class="help is-danger is-justify-content-center">
            {{ errorMessage }}
          </p>
        </div>
        <div
          v-if="posts.length === 0 && !isLoading && !errorMessage"
          class="has-text-centered"
        >
          <p>No posts yet</p>
        </div>
        <div v-else-if="isLoading" class="has-text-centered"><Loader /></div>

        <table
          v-else
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
            <tr v-for="post of posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="{
                    'is-light': isSidebarOpen && post.id === selectedPost?.id,
                  }"
                  @click="previewSelectedPost(post)"
                >
                  {{ post.id === selectedPost?.id ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <TransitionGroup name="sidebar">
          <Sidebar v-if="isSidebarOpen">
            <PostPreview
              v-if="selectedPost && !isEditing"
              :post="selectedPost"
              :onEdit="handlePostEditing"
              :onDelete="handlePostDelete"
            />
            <AddPostForm
              v-else
              :post="selectedPost"
              @post-added="addNewPost"
              @close-sidebar="closeSidebar"
            />
          </Sidebar>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.5s ease;
}
.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
