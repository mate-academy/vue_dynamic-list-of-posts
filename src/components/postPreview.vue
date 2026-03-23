<script setup>
import useCommentsStore from "@/stores/commentsStore";
import usePostsStore from "@/stores/postsStore";
import useSidebarStore from "@/stores/sidebarStore";
import useUserStore from "@/stores/userStore";
import { computed, ref, watchEffect } from "vue";

const userStore = useUserStore();
const postsStore = usePostsStore();
const sidebarStore = useSidebarStore();
const commentsStore = useCommentsStore();

const error = ref("");

const post = computed(() => {
  return postsStore.posts.find((p) => p.id === postsStore.activePostId) || null;
});

watchEffect(async () => {
  if (
    sidebarStore.isOpen &&
    !sidebarStore.openNewPost &&
    postsStore.activePostId
  ) {
    try {
      await commentsStore.fetchCommentsByPostId(postsStore.activePostId);
    } catch (error) {
      error.value = `Error fetching data: ${error}.\n Please try again..`;
    }
  }
});

const handleDelete = async () => {
  try {
    await postsStore.removePost(postsStore.activePostId, userStore.user.id);

    sidebarStore.close();
  } catch (error) {
    error.value = `Failed to delete post, reverting: ${error}`;
  }
};

const handleUpdate = () => {
  sidebarStore.editPost = true;
};

const handleDeleteError = () => {
  error.value = "";
};
</script>

<template>
  <div class="block" v-if="post">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="handleUpdate">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="handleDelete"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>
  </div>

  <article v-if="error" class="message is-danger" style="margin-top: 10px">
    <div class="message-header">
      <p>Error Message</p>
      <button
        @click="handleDeleteError"
        class="delete"
        aria-label="delete"
      ></button>
    </div>
    <div class="message-body">
      {{ error }}
    </div>
  </article>
</template>
