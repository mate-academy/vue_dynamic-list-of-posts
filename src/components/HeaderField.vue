<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const handleLogout = () => {
  userStore.logout();
};

</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="title is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5">
            <p>User: {{userStore.user.name}}</p>
          </div>

          <a class="button is-light" @click="handleLogout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>
