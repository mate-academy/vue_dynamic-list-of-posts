<script setup>
import PostsList from "./PostsList.vue";
import Sidebar from "./sidebar/index.vue";

</script>

<template>
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <PostsList />

        <Sidebar />
      </div>
    </div>
  </main>
</template>