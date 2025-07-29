<script setup>
import { ref } from "vue";
import Login from "./components/login.vue";
import PostsList from "./components/postsList.vue";

const isAuthenticated = ref(false);
const userId = ref(2311);

</script>

<template>
  <Login
    v-if="!isAuthenticated"
    @login-success="
      (id) => {
        isAuthenticated = true;
        userId = id;
      }
    "
  />

  <PostsList v-else :userId="userId" />
</template>
