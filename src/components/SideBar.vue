<script setup>
import PostPreview from './PostPreview.vue'
const { isSidebarOpen, selectedPost } = defineProps({
  isSidebarOpen: {
    type: Boolean
  },
  selectedPost: {
    type: Object
  }
})

const emits = defineEmits(['deletePost'])
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isSidebarOpen }">
    <div class="tile is-child box is-success">
      <div class="content">
        <PostPreview
          v-if="selectedPost.id"
          :selectedPost
          @deletePost="emits('deletePost', $event)"
        />
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
