<script setup>
import AddPost from "./AddPost.vue";
import PostPreview from "./PostPreview.vue";

const props = defineProps({
  user: Object,
  newPost: Boolean,
  sidebarOpen: Boolean,
  selectedPost: Object,
});

const emit = defineEmits([
  "closeSidebar",
  "postUpdated",
  "postAdded",
  "postDelete",
]);
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar">
    <div v-if="sidebarOpen" class="tile is-child box is-success">
      <div class="content">
        <AddPost
          v-if="newPost"
          :user="user"
          @closeSidebar="$emit('closeSidebar')"
          @postAdded="$emit('postAdded', $event)"
        />
        <PostPreview
          v-else
          :selectedPost="selectedPost"
          :user="user"
          @postUpdated="$emit('postUpdated', $event)"
          @postDelete="$emit('postDelete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
