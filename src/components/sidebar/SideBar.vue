<script setup>
import AddPost from '../modules/AddPost.vue';
import PostPreview from '../modules/PostPreview.vue';
import { usePostStore } from '../../stores/postsStore';

const postStore = usePostStore();
</script>
<template>
  <div class="tile is-child box is-success">
    <div class="content">
      <AddPost v-if="postStore.isAddPostBtnActive" />
      <PostPreview v-if="postStore.isCommentDetailsActive" />
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
    max-width: 100%;
  }
}
</style>
