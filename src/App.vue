<script setup>
import { ref, onMounted } from 'vue';
import { getPosts } from './api/posts';
import TheNavbar from './components/Layout/TheNavbar.vue';
import TheSidebar from './components/Layout/TheSidebar.vue';
import PostList from './components/Posts/PostList.vue';
import AppLoader from './components/Base/AppLoader.vue';
import LoginForm from './components/Auth/LoginForm.vue';

const currentUser = ref({ name: 'Paulina', id: 1 });
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

onMounted(fetchPosts);
</script>

<template>
  <template v-if="currentUser">
    <TheNavbar :user="currentUser" @logout="currentUser = null" />

    <main class="section">
      <div class="container">
        <div v-if="errorMessage" class="notification is-danger">
          <button class="delete" @click="errorMessage = ''"></button>
          {{ errorMessage }}
        </div>

        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child box is-success">
              <AppLoader v-if="isLoading" />
              <PostList v-else-if="posts.length > 0" :posts="posts" />
              <h3 v-else class="mt-2 has-text-centered">No posts yet.</h3>
            </div>
          </div>
          <TheSidebar />
        </div>
      </div>
    </main>
  </template>

  <LoginForm v-else @login="handleLogin" />
</template>

<style></style>
