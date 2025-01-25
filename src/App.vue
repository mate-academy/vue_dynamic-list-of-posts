<script setup>
import { watch } from "vue";
import RegisterForm from "./components/RegisterForm.vue";
import PostList from "./components/PostList.vue";
import { usePostStore } from "./stores/posts";
import LoaderField from "./components/LoaderField.vue";
import { useUserStore } from "./stores/user";
import HeaderField from "./components/HeaderField.vue";

const postStore = usePostStore();
const userStore = useUserStore();

watch(
  () => userStore.user,
  async (newUser) => {
    if (newUser) {
      await postStore.fetchPosts(newUser.id);
    }
  }
);
</script>

<template>
  <RegisterForm v-if="!userStore.user" />
  <HeaderField v-else />
  <main v-if="userStore.user" class="section">
    <div
      v-if="postStore.isLoadingPost"
      className="is-flex is-justify-content-center is-align-items-center mt-2"
    >
      <LoaderField />
    </div>

    <PostList v-else />
  </main>
</template>

<style></style>
