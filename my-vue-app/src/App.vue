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
  if (selectedPost.value?.id === post.id) {
    cancel();
  } else {
    isAddingPost.value = false;
    isEditing.value = false;
    selectedPost.value = post;
  }
};

const cancel = () => {
  selectedPost.value = null;
  isAddingPost.value = false;
  isEditing.value = false;
};

const handlePostSubmit = async (data) => {
  if (isEditing.value) {
    try {
      const res = await fetch(`https://mate.academy/students-api/posts/${selectedPost.value.id}`, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedPost = await res.json();
      const index = posts.value.findIndex(p => p.id === selectedPost.value.id);
      posts.value[index] = updatedPost;
      selectedPost.value = updatedPost;
      isEditing.value = false;
    } catch {
      alert('Failed to update post.');
    }
  } else {
    try {
      const res = await fetch(`https://mate.academy/students-api/posts`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ ...data, userId: USER_ID })
      });
      const newPost = await res.json();
      posts.value.push(newPost);
      selectedPost.value = newPost;
      isAddingPost.value = false;
    } catch {
      alert('Failed to create post.');
    }
  }
};

const deletePost = async (id) => {
  try {
    await fetch(`https://mate.academy/students-api/posts/${id}`, { method: 'DELETE' });
    posts.value = posts.value.filter(p => p.id !== id);
    cancel();
  } catch {
    alert('Failed to delete post.');
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
              :isAddingActive="isAddingPost" @toggle="handleToggle"
              @add="isAddingPost = true; selectedPost = null; isEditing = false"
              @retry="fetchPosts"
            />
            </div>

            <div v-if="isAddingPost || selectedPost" class="column is-5 Sidebar--open">
              <PostForm v-if="isAddingPost || isEditing" :initialPost="isEditing ? selectedPost : null" @submit="handlePostSubmit" @cancel="cancel" />
              <PostDetails v-else-if="selectedPost" :post="selectedPost" @edit="isEditing = true" @delete="deletePost" />
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>
