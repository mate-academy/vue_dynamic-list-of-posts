<script setup>
import { onMounted } from "vue";
import { usePostsStore } from "@/stores/postsStore";
import { useUserStore } from "@/stores/userStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import Loader from "./loader.vue";

const postsStore = usePostsStore();
const userStore = useUserStore();
const sidebarStore = useSidebarStore();

onMounted(async () => {
  userStore.init();
  if (userStore.user) {
    await postsStore.fetchPostsByUserId(userStore.user.id);
  }
});

const handleAddNewPostClick = () => {
  postsStore.setActivePost(null);
  sidebarStore.openNewPost = true;
  sidebarStore.open();
};

const handleOpenPostClick = (postId) => {
  const isSamePost = postsStore.activePostId === postId;

  if (isSamePost) {
    postsStore.setActivePost(null);
    sidebarStore.close();
    sidebarStore.openNewPost = false;
    sidebarStore.editPost = false;
    sidebarStore.writeACommentBtn = false;
  } else {
    postsStore.setActivePost(postId);
    sidebarStore.open();
    sidebarStore.openNewPost = false;
    sidebarStore.writeACommentBtn = false;
    sidebarStore.editPost = false;
  }
};
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            @click="handleAddNewPostClick"
          >
            Add New Post
          </button>
        </div>

        <Loader v-if="postsStore.isLoading" />

        <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in postsStore.posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': postsStore.activePostId !== post.id }"
                  @click="handleOpenPostClick(post.id)"
                >
                  {{ postsStore.activePostId === post.id ? "Close" : "Open" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
