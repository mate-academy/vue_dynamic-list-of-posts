<script setup lang="ts">
import { ref, watch } from "vue";
import { Post } from "../../types/post";
import { User } from "../../types/user";
import Header from "./Header.vue";
import PostList from "./PostList/PostList.vue";
import Sidebar from "./Sidebar/Sidebar.vue";

const props = defineProps<{
  user?: User;
  postList: Post[];
  handleClickLogout: () => void;
}>();

const userName = ref<User | null>(props.user || null);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      userName.value = newUser!;
    }
  },
  { immediate: true }
);
</script>

<template>
  <Header :user="userName!" :handle-click-logout="handleClickLogout" />
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <PostList :posts="postList" />
        <Sidebar />
      </div>
    </div>
  </main>
</template>

<style>
@media screen and (min-width: 769px), print {
  .tile:not(.is-child) {
    display: flex;
  }
}

.tile.is-ancestor {
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
}
</style>
