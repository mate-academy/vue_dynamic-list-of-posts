<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import AppHeader from './components/AppHeader.vue';
import LoginPage from './components/LoginPage.vue';
import PostsList from './components/PostsList.vue';

const user = ref({});
const errorMessage = ref('');
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await axios.get('/api/posts');
    posts.value = response.data;
  } catch (error) {
    errorMessage.value = 'Failed to load posts. Please try again later.';
  } finally {
    isLoading.value = false;
  }
});

const saveUser = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
  user.value = userData;
};

const removeUser = () => {
  localStorage.removeItem('user');
  user.value = {};
};

const isLoggedIn = computed(() => Boolean(user.value.id));
</script>


<template>
  <LoginPage v-if="!isLoggedIn()" @addUser="saveUser" />

  <template v-else>
    <AppHeader :user="user.value" @log-out="removeUser" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor is-flex is-flex-wrap-wrap">
          <PostsList :user-id="user.value.id" />
        </div>

        <div v-if="errorMessage" class="notification is-danger">
          {{ errorMessage }}
        </div>

        <div v-if="isLoading" class="notification is-info">
          Loading posts...
        </div>
      </div>
    </main>
  </template>
</template>


<style></style>
