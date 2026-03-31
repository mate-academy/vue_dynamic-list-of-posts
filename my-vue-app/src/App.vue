<script setup>
import { ref } from 'vue';
import './App.css';

import PostList from './components/PostList.vue';
import PostForm from './components/PostForm.vue';
import PostDetails from './components/PostDetails.vue';
import LoginForm from './components/LoginForm.vue';

const USER_ID = 11;
const currentUser = ref(null);
const posts = ref([]);
const selectedPost = ref(null);
const isAddingPost = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const hasError = ref(false);

// Stany błędów akcji
const postActionError = ref(null);

const handleLogin = (userData) => {
  currentUser.value = { ...userData, id: USER_ID };
  fetchPosts();
};

const fetchPosts = async () => {
  isLoading.value = true;
  hasError.value = false;
  try {
    const res = await fetch(`https://mate.academy/students-api/posts?userId=${USER_ID}`);
    if (!res.ok) throw new Error('Failed to load posts');
    posts.value = await res.json();
  } catch {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleToggle = (post) => {
  postActionError.value = null; // reset komunikatu bledu przy przelaczaniu
  if (selectedPost.value?.id === post.id) {
    cancel();
  } else {
    isAddingPost.value = false;
    isEditing.value = false;
    selectedPost.value = post;
  }
};

const cancel = () => {
  postActionError.value = null;
  selectedPost.value = null;
  isAddingPost.value = false;
  isEditing.value = false;
};

// Dodawanie i edycja z funkcja Retry
const handlePostSubmit = async (data) => {
  postActionError.value = null;
  try {
    const method = isEditing.value ? 'PATCH' : 'POST';
    const url = isEditing.value
      ? `https://mate.academy/students-api/posts/${selectedPost.value.id}`
      : `https://mate.academy/students-api/posts`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ ...data, userId: USER_ID })
    });

    if (!res.ok) throw new Error();
    const result = await res.json();

    if (isEditing.value) {
      const index = posts.value.findIndex(p => p.id === selectedPost.value.id);
      posts.value[index] = result;
      selectedPost.value = result;
      isEditing.value = false;
    } else {
      posts.value.push(result);
      selectedPost.value = result;
      isAddingPost.value = false;
    }
  } catch {
    // Zapamietujemy funkcje do wywolania ponownego jako wartosc zmiennej
    postActionError.value = () => handlePostSubmit(data);
  }
};

// Usuwanie z funkcja Retry
const deletePost = async (id) => {
  postActionError.value = null;
  try {
    const res = await fetch(`https://mate.academy/students-api/posts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    posts.value = posts.value.filter(p => p.id !== id);
    cancel();
  } catch {
    postActionError.value = () => deletePost(id);
  }
};
</script>

<template>
  <div class="app-root min-vh-100">
    <LoginForm v-if="!currentUser" @login="handleLogin" />

    <div v-else>
      <nav class="navbar is-white has-shadow px-5">
        <div class="navbar-brand">
          <span class="navbar-item is-size-4 has-text-weight-bold">Vue List Of Posts</span>
        </div>
        <div class="navbar-end is-flex is-align-items-center">
          <div class="navbar-item">User: {{ currentUser.name }}</div>
          <div class="navbar-item">
            <button class="button is-light" @click="currentUser = null">Logout</button>
          </div>
        </div>
      </nav>

      <main class="section">
        <div class="container is-fluid">
          <div class="columns">
            <div class="column" :class="{ 'is-7': selectedPost || isAddingPost, 'is-12': !selectedPost && !isAddingPost }">
              <PostList
                :posts="posts"
                :selectedPostId="selectedPost?.id"
                :isLoading="isLoading"
                :hasError="hasError"
                :isAddingActive="isAddingPost"
                @toggle="handleToggle"
                @add="isAddingPost = true; selectedPost = null; isEditing = false; postActionError = null"
                @retry="fetchPosts"
              />
            </div>

            <div v-if="isAddingPost || selectedPost" class="column is-5 Sidebar--open">

              <div v-if="postActionError" class="notification is-danger mb-4">
                <button class="delete" @click="postActionError = null"></button>
                Action failed.
                <button class="button is-small is-light ml-2" @click="postActionError()">Retry</button>
              </div>

              <PostForm v-if="isAddingPost || isEditing" :initialPost="isEditing ? selectedPost : null" @submit="handlePostSubmit" @cancel="cancel" />
              <PostDetails v-else-if="selectedPost" :post="selectedPost" @edit="isEditing = true" @delete="deletePost" />
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>
