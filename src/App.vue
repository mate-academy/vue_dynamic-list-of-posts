<script setup>
import { computed } from "vue";
import Header from "./components/header.vue";
import Login from "./components/login.vue";
import PostsList from "./components/postsList.vue";
import Sidebar from "./components/sidebar.vue";

import useUserStore from "./stores/userStore";
import useSidebarStore from "./stores/sidebarStore";

const sidebarStore = useSidebarStore();
const userStore = useUserStore();
userStore.init();
const isAuthenticated = computed(() => userStore.user !== null);
</script>

<template>
  <Login v-if="!isAuthenticated" />
  <div v-else>
    <Header></Header>
    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostsList />
          <Sidebar />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
.tile {
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  align-items: stretch;
  min-height: -webkit-min-content;
  min-height: -moz-min-content;
  min-height: min-content;
}

@media screen and (min-width: 769px), print {
  .tile:not(.is-child) {
    display: flex;
  }
}
</style>
