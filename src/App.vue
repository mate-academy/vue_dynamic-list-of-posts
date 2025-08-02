<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import LoginPage from './components/LoginPage.vue';
import PostsList from './components/PostsList.vue';

const user = ref({});

onMounted(() => {
  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    user.value = JSON.parse(storedUser);
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

const isLoggedIn = () => Boolean(user.value.id);
</script>

<template>
  <LoginPage v-if="!isLoggedIn()" @addUser="saveUser" />

  <template v-else>
    <AppHeader :user="user" @log-out="removeUser" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor is-flex is-flex-wrap-wrap">
          <PostsList :user-id="user.id" />
        </div>
      </div>
    </main>
  </template>
</template>

<style></style>
