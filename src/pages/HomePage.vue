<script setup>
import { inject } from "vue";
import PostList from "../components/PostList.vue";
import { router } from "../../routes";
import Header from "@/components/Header.vue";


const user = inject("existingUser");

const logoutHandler = () => {
  user.name = "";
  user.email = "";
  localStorage.clear("user");
  router.push("/login");
};


</script>

<template>
  <Header :user="user" :logoutHandler="logoutHandler" />
  <PostList/>
</template>

<style>
main {
  display: flex;
  justify-content: center;
}
</style>
