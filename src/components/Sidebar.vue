<script setup>
import AddPost from "@/components/AddPost.vue";
import { defineModel } from "vue";
import { usePostStore } from "@/store/postStore.js";
import PostPreview from "./PostPreview.vue";

const showCreatePost = defineModel();
const globalState = usePostStore();

</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': showCreatePost || globalState.state.showComments}"
  >
    <div class="tile is-child box is-success ">
      <div class="content">
        <h2 v-if="showCreatePost">Create new post</h2>
        <AddPost v-if="showCreatePost"/>
        <PostPreview v-if="globalState.state.showComments"/>
        <AddPost v-if="globalState.state.isComment" :isComment="true"/>
        <AddPost v-if="globalState.state.isEditing" :isEditing="true"/>

      </div>
    </div>
  </div>
</template>
<style scoped>
.Sidebar {
  opacity: 0;
  overflow: hidden;
  transition-property: max-width, opacity;
  transition-duration: .5s;
  transition-timing-function: ease-in-out;
  height: 0;



  @media screen and (min-width: 769px) {
  flex: 0 0 0% !important;
  width: 0 !important;
  max-width: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  transition: all 0.5s ease-in-out;
  }
}
.Sidebar--open {
  opacity: 1;
  height: auto;

  
  @media screen and (min-width: 769px) {
  flex: 0 0 50% !important;
  width: 50% !important;
  max-width: 50% !important;
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
  }

}
</style>
