<script setup lang="ts">
import { ref } from "vue";
import { User } from "./types/user";
import PostsPage from "./components/PostsPage/PostsPage.vue";
import LoginPage from "./components/LoginPage/LoginPage.vue";

const userIdData = localStorage.getItem("userId");
const user = ref<User | null>(null)!;
const userId = ref<number | null>(userIdData ? JSON.parse(userIdData) : null);

const handleSubmitUserId = (newUserId: number) => {
  userId.value = newUserId;
};

const setNewUser = (newUser: User) => {
  user.value = newUser;
};
</script>

<template>
  <template v-if="!userId">
    <LoginPage :handle-submit-user-id="handleSubmitUserId" :set-new-user="setNewUser" />
  </template>
  <template v-else>
    <PostsPage :currentUser="user" :currentUserId="userId" />
  </template>
</template>

<style scoped></style>
