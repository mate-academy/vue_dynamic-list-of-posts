<script setup>
import { usePostsStore } from "@/store/storePosts";
import { useUserStore } from "@/store/storeUser";
import { defineEmits } from "vue";
const emit = defineEmits(["logout"]);

const { user } = useUserStore();

const { setIsCreating } = usePostsStore();

const handleLogout = () => {
  setIsCreating(false);
  emit("logout", []);
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
            <p>User: {{ user.name }}</p>
          </div>

          <a class="button is-light" @click="handleLogout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>
