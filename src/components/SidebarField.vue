<script setup>
import { onMounted, watch } from "vue";
import NoCommentsYet from "./NoCommentsYet.vue";
import PostPreview from "./PostPreview.vue";
import { getComments } from "@/api/comments";
import CommentsList from "./CommentsList.vue";
import { usePostStore } from "@/stores/posts";
import { useCommentsStore } from "@/stores/comments";
import AddComment from "./AddComment.vue";
import AddPost from "./AddPost.vue";

const postStore = usePostStore();
const commentStore = useCommentsStore();

// const gettingComments = async () => {
//   if (postStore.currentPost?.id) {
//     try {
//       const response = await getComments(postStore.currentPost?.id);
//       commentStore.setComments(response.data);
//     } catch (error) {
//       console.log("Error fetching comments:", error);
//     }
//   }
// };

// onMounted(gettingComments);
// watch(postStore.currentPost, gettingComments, { immediate: true });
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{
      'Sidebar--open':
        postStore.isShowDetailsPost || commentStore.isShowCommentForm || postStore.isShowPostForm,
    }"
  >
    <div class="tile is-child box is-success">
      <div v-if="postStore.isShowPostForm" class="content">
        <AddPost />
      </div>
      <div v-else class="content">
        <PostPreview />
        <NoCommentsYet v-if="!commentStore.comments.length" />
        <CommentsList v-if="postStore.isShowDetailsPost" />
        <AddComment v-if="commentStore.isShowCommentForm" />
      </div>
    </div>
  </div>
</template>

<style scoped land="scss">
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
