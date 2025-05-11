<script setup>
import "./index.scss";
import PostPreview from "./components/PostPreview.vue";
import AddPost from "./components/AddPost.vue";
import EditPost from "./components/EditPost.vue";
import { usePostsStore } from "@/store/storePosts";
import { storeToRefs } from "pinia";

const postStore = usePostsStore();

const { posts, isLoading, error, isCreating, selectedPost, isEditing } =
  storeToRefs(postStore);

</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar " :class="{'Sidebar--open': isCreating || selectedPost}">
    <div class="tile is-child box is-success">
      <div class="content">
        <PostPreview v-if="selectedPost && !isEditing"/>

        <AddPost v-if="isCreating"/>

        <EditPost v-if="isEditing" />
      </div>
    </div>
  </div>
</template>
