<script setup>
import { defineProps, defineEmits } from 'vue';
import PostPreview from "./PostPreview.vue";
import PostForm from "./PostForm.vue";

const { isActiveSidebar, selectedPost } = defineProps([
  "isActiveSidebar",
  "selectedPost",
]);
const emit = defineEmits([
  "addPost",
  "closeSidebar",
  "updatePost",
  "deletePost",
]);
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isActiveSidebar }"
  >
    <div class="tile is-child box is-success">
      <div class="tile is-child box is-success">
        <div class="content">
          <PostPreview
            v-if="selectedPost"
            :selectedPost="selectedPost"
            @closeSidebar="emit('closeSidebar')"
            @updatePost="emit('updatePost', $event)"
            @deletePost="emit('deletePost', $event)"
          />
          <PostForm
            v-else
            @addPost="emit('addPost', $event)"
            @closeSidebar="emit('closeSidebar')"
          />
          <!-- Content here -->
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
  @media (min-width: 769px) {
    max-width: 0;
  }
}
.Sidebar--open {
  opacity: 1;
  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>
