<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getPosts, getUser } from "./apiClient";
import { Post } from "./types/post";
import { User } from "./types/user";
import PostsPage from "./components/PostsPage/PostsPage.vue";
import LoginPage from "./components/LoginPage/LoginPage.vue";

const userIdData = localStorage.getItem("userId");
const postList = ref<Post[]>([]);
const userId = ref<number | null>(userIdData ? JSON.parse(userIdData) : null);
const user = ref<User | null>(null)!;

const fetchUserData = async (id: number) => {
  try {
    const postsData = await getPosts(id);
    const userData = await getUser(id);

    postList.value = postsData;
    user.value = userData;
  } catch (err) {
    alert(`An error occurred: ${err}`);
    userId.value = null;
  }
};

watch(
  userId,
  async (newValue: number | null) => {
    if (newValue !== null) {
      localStorage.setItem("userId", JSON.stringify(newValue));
      await fetchUserData(newValue);
    } else {
      localStorage.removeItem("userId");
      postList.value = [];
      user.value = null;
    }
  },
  { deep: true }
);

onMounted(async () => {
  if (userId.value !== null) {
    await fetchUserData(userId.value);
  }
});

const handleClickLogout = () => {
  userId.value = null;
};

const handleSubmitUserId = (newUserId: number) => {
  userId.value = newUserId;
};

const setNewUser = (newUser: User) => {
  user.value = newUser;
};

console.log(postList);
</script>

<template>
  <template v-if="!userId">
    <LoginPage :handle-submit-user-id="handleSubmitUserId" :set-new-user="setNewUser" />
  </template>
  <template v-else>
    <PostsPage :user="user!" :post-list="postList" :handle-click-logout="handleClickLogout" />
  </template>
</template>

<style scoped></style>
