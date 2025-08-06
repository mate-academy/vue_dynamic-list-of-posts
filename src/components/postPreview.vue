<script setup>
import { usePostsStore } from "@/stores/postsStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useCommentsStore } from "@/stores/commentsStore";

import { ref, watchEffect } from "vue";
import { getPostById } from "../api/posts";

const postsStore = usePostsStore();
const sidebarStore = useSidebarStore();
const commentsStore = useCommentsStore();

const post = ref(null);

watchEffect(async () => {
  if (
    sidebarStore.isOpen &&
    !sidebarStore.openNewPost &&
    postsStore.activePostId
  ) {
    try {
      const response = await getPostById(postsStore.activePostId);
      post.value = response.data;

      await commentsStore.fetchCommentsByPostId(postsStore.activePostId);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  } else {
    post.value = null;
  }
});

const handleEdit = () => {
  sidebarStore.editPost = true;
  sidebarStore.openNewPost = false;
  sidebarStore.writeACommentBtn = false;
  postsStore.lastActivePostId = postsStore.activePostId;
};

const handleDelete = async () => {
  try {
    await postsStore.removePost(postsStore.activePostId);
    sidebarStore.close();
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}
</script>

<template>
  <div class="block" v-if="post">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable">
          <i @click="handleEdit" class="fas fa-pen-to-square"></i>
        </span>
        <span class="icon is-small is-right has-text-danger is-clickable ml-3">
          <i @click="handleDelete" class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>
  </div>
</template>
