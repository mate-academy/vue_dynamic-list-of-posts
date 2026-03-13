<script setup>
import { ref, onMounted } from 'vue';
import { getPosts } from './api/posts';
import { getUserByEmail } from './api/users';
import TheNavbar from './components/Layout/TheNavbar.vue';
import TheSidebar from './components/Layout/TheSidebar.vue';
import PostList from './components/Posts/PostList.vue';
import AppLoader from './components/Base/AppLoader.vue';
import LoginForm from './components/Auth/LoginForm.vue';

const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null);
const posts = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const fetchPosts = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    posts.value = await getPosts(currentUser.value.id);
  } catch (error) {
    errorMessage.value = 'Failed to load posts. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const handleLogin = async (email) => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const users = await getUserByEmail(email);

    if (users.length > 0) {
      currentUser.value = users[0];
      localStorage.setItem('user', JSON.stringify(users[0]));
      await fetchPosts();
    } else {
      errorMessage.value = 'User not found. Please check your email.';
    }
  } catch (error) {
    errorMessage.value = `Login failed: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  currentUser.value = null;
  posts.value = [];
  localStorage.removeItem('user');
};

onMounted(() => {
  if (currentUser.value) {
    fetchPosts();
  }
});
</script>

<template>
  <div v-if="errorMessage" class="notification is-danger mt-2 container">
    <button class="delete" @click="errorMessage = ''"></button>
    {{ errorMessage }}
  </div>

  <template v-if="currentUser">
    <TheNavbar :user="currentUser" @logout="handleLogout" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child box is-success">
              <AppLoader v-if="isLoading" />
              <PostList v-else-if="posts.length > 0" :posts="posts" />
              <h3 v-else-if="!isLoading" class="mt-2 has-text-centered">
                No posts yet.
              </h3>
            </div>
          </div>
          <TheSidebar />
        </div>
      </div>
    </main>
  </template>

  <div v-else class="container">
    <AppLoader v-if="isLoading" />
    <LoginForm v-else @login="handleLogin" />
  </div>
</template>

<style></style>
