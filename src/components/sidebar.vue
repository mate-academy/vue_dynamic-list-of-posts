<script setup>
import { onMounted } from "vue";

import { useSidebarStore } from "@/stores/sidebarStore";
import { usePostsStore } from "@/stores/postsStore";
import { useCommentsStore } from "@/stores/commentsStore";

import PostPreview from "./postPreview.vue";
import NoCommentsYet from "./noCommentsYet.vue";
import WriteCommentBtn from "./writeCommentBtn.vue";
import AddPost from "./addPost.vue";
import AddCommentForm from "./addCommentForm.vue";
import Comment from "./comment.vue";
import EditPostForm from "./editPostForm.vue";
import Loader from "./loader.vue";

const sidebarStore = useSidebarStore();
const postsStore = usePostsStore();
const commentsStore = useCommentsStore();

onMounted(() => {
  if (postsStore.activePostId) {
    commentsStore.fetchCommentsByPostId(postsStore.activePostId);
  }
});
</script>

<template>
  <div
    :class="[
      'tile is-parent is-8-desktop Sidebar',
      { 'Sidebar--open': sidebarStore.isOpen },
    ]"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <AddPost v-if="sidebarStore.openNewPost && !sidebarStore.editPost" />
        <PostPreview v-if="!sidebarStore.openNewPost && !sidebarStore.editPost" />
        <Loader v-if="commentsStore.isLoading"/>
        <EditPostForm v-if="!sidebarStore.openNewPost && sidebarStore.editPost" />
        <NoCommentsYet v-if="commentsStore.comments.length === 0 && !sidebarStore.openNewPost && !sidebarStore.editPost && !commentsStore.isLoading" />
        <Comment
          v-if="!sidebarStore.openNewPost && !sidebarStore.editPost && !commentsStore.isLoading"
          v-for="comment in commentsStore.comments"
          :key="comment.id"
          :comment="comment"
          :post-id="postsStore.activePostId"
        />

        <WriteCommentBtn v-if="!sidebarStore.writeACommentBtn && !sidebarStore.openNewPost && !sidebarStore.editPost && !commentsStore.isLoading" />
        <AddCommentForm v-if="sidebarStore.writeACommentBtn && !sidebarStore.openNewPost && !sidebarStore.editPost" />
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
