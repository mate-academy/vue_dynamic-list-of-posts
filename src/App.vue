<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import Navbar from "./components/Navbar.vue";
import PostList from "./components/PostList.vue";
import type { User } from "./types/User";
import { UsersAPI } from "./api/client";

const USER_ID: number = 3264;
const user = ref<User | null>(null);

onMounted(async () => {
  try {
    const singleUser = await UsersAPI.getSingleUser(USER_ID);
    user.value = singleUser;
  } catch (err) {
    console.error("Failed to load user:", err);
  }
});

provide("user", user);
provide("userId", USER_ID);
</script>

<template>
  <Navbar></Navbar>
  <main class="section">
    <div class="container">
      <PostList></PostList>
    </div>
  </main>
</template>

<style></style>
