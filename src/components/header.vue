<script setup>
import useUserStore from "@/stores/userStore";
import { computed } from "vue";

const userStore = useUserStore();

const userName = computed(() => userStore.user?.name || "Guest");

const logout = () => {
  userStore.logout();
};
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ userName }}</p>
          </div>

          <a class="button is-light" @click="logout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>
