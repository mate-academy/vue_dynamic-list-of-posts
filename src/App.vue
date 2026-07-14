<script setup>
import { ref, onMounted } from 'vue';

import { getPosts, createPost, updatePost, deletePost } from './api/api';
import Header from './components/Header.vue';
import Login from './components/Login.vue';
import PostsList from './components/PostsList.vue';
import Sidebar from './components/Sidebar.vue';
import PostForm from './components/PostForm.vue';
import PostPreview from './components/PostPreview.vue';
import Loader from './components/Loader.vue';

const currentUser = ref(null);
const posts = ref([]);
const postsLoading = ref(false);
const postsError = ref('');

const isSidebarOpen = ref(false);
const sidebarMode = ref('preview');
const selectedPost = ref(null);
const sidebarLoading = ref(false);
const sidebarError = ref('');

const fetchUserPosts = async (userId) => {
  postsLoading.value = true;
  postsError.value = '';
  try {
    const fetchedPosts = await getPosts(userId);
    posts.value = fetchedPosts;
  } catch (error) {
    postsError.value = 'Failed to load posts.';
  } finally {
    postsLoading.value = false;
  }
};

const handleLoggedIn = (user) => {
  currentUser.value = user;
  localStorage.setItem('logged-in-user', JSON.stringify(user));
  fetchUserPosts(user.id);
};

const handleLogout = () => {
  currentUser.value = null;
  localStorage.removeItem('logged-in-user');
  posts.value = [];
  isSidebarOpen.value = false;
  selectedPost.value = null;
};

const handleSelectPost = (post) => {
  selectedPost.value = post;
  sidebarMode.value = 'preview';
  isSidebarOpen.value = true;
};

const handleDeselectPost = () => {
  selectedPost.value = null;
  isSidebarOpen.value = false;
};

const handleOpenCreateForm = () => {
  selectedPost.value = null;
  sidebarMode.value = 'create';
  isSidebarOpen.value = true;
};

const handleFormCancel = () => {
  if (sidebarMode.value === 'edit') {
    sidebarMode.value = 'preview';
  } else {
    isSidebarOpen.value = false;
  }
};

const handleFormSubmit = async (formData) => {
  sidebarLoading.value = true;
  sidebarError.value = '';

  try {
    if (sidebarMode.value === 'create') {
      const newPost = await createPost({
        userId: currentUser.value.id,
        title: formData.title,
        body: formData.body,
      });
      posts.value.push(newPost);
      selectedPost.value = newPost;
      sidebarMode.value = 'preview';
    } else if (sidebarMode.value === 'edit' && selectedPost.value) {
      const updated = await updatePost(selectedPost.value.id, {
        title: formData.title,
        body: formData.body,
        userId: currentUser.value.id,
      });
      const index = posts.value.findIndex(p => p.id === updated.id);
      if (index !== -1) {
        posts.value[index] = updated;
      }
      selectedPost.value = updated;
      sidebarMode.value = 'preview';
    }
  } catch (error) {
    sidebarError.value = 'Failed to save post. Please try again.';
  } finally {
    sidebarLoading.value = false;
  }
};

const handleDeletePost = async () => {
  if (!selectedPost.value) return;

  sidebarLoading.value = true;
  sidebarError.value = '';

  try {
    await deletePost(selectedPost.value.id);
    const index = posts.value.findIndex(p => p.id === selectedPost.value.id);
    if (index !== -1) {
      posts.value.splice(index, 1);
    }
    selectedPost.value = null;
    isSidebarOpen.value = false;
  } catch (error) {
    sidebarError.value = 'Failed to delete post. Please try again.';
  } finally {
    sidebarLoading.value = false;
  }
};

onMounted(() => {
  const savedUser = localStorage.getItem('logged-in-user');
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser);
    fetchUserPosts(currentUser.value.id);
  }
});
</script>

<template>
  <div id="app">
    <div v-if="!currentUser">
      <Login @logged-in="handleLoggedIn" />
    </div>

    <div v-else>
      <Header :user="currentUser" @logout="handleLogout" />

      <main class="section">
        <div class="container">
          <div v-if="sidebarError" class="notification is-danger">
            <button @click="sidebarError = ''" class="delete" aria-label="close"></button>
            {{ sidebarError }}
          </div>

          <div v-if="postsLoading" class="is-flex is-justify-content-center is-align-items-center mt-6">
            <Loader />
          </div>

          <div v-else-if="postsError" class="notification is-danger">
            {{ postsError }}
            <button @click="fetchUserPosts(currentUser.id)" class="button is-small is-danger is-light ml-2">
              Retry
            </button>
          </div>

          <div v-else class="tile is-ancestor">
            <div class="tile is-parent">
              <div v-if="posts.length === 0" class="tile is-child box is-warning">
                <p class="title is-4">No posts yet</p>
                <button
                  @click="handleOpenCreateForm"
                  type="button"
                  class="button is-link mt-3"
                >
                  Create post
                </button>
              </div>

              <PostsList
                v-else
                :posts="posts"
                :selected-post-id="selectedPost ? selectedPost.id : null"
                @select-post="handleSelectPost"
                @deselect-post="handleDeselectPost"
                @open-create-form="handleOpenCreateForm"
              />
            </div>

            <Sidebar :is-open="isSidebarOpen">
              <PostForm
                v-if="sidebarMode === 'create' || sidebarMode === 'edit'"
                :post="sidebarMode === 'edit' ? selectedPost : null"
                :is-loading="sidebarLoading"
                @submit="handleFormSubmit"
                @cancel="handleFormCancel"
              />
              <PostPreview
                v-else-if="sidebarMode === 'preview' && selectedPost"
                :post="selectedPost"
                @edit="sidebarMode = 'edit'"
                @delete="handleDeletePost"
              />
            </Sidebar>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
