<script setup>
import PostPreview from './PostPreview.vue'
import PostForm from './PostForm.vue'
const { isSidebarOpen, selectedPost, isFormOpen } = defineProps({
  isSidebarOpen: Boolean,
  selectedPost: Object,
  isFormOpen: Boolean
})

const emits = defineEmits(['deletePost', 'closeForm', 'addPost'])
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

        <PostForm
          v-else-if="!selectedPost.id && isFormOpen"
          name="addPost"
          @closeForm="emits('closeForm')"
          @addPost="emits('addPost', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
