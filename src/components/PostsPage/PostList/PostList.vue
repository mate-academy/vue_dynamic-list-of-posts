<script setup lang="ts">
import { Post } from "../../../types/post";
import { SidebarStatus } from "../../../types/sidebar";
import PostInfo from "./PostInfo.vue";

defineProps<{
  posts: Post[];
  chosenPost: Post | null;
  changeChosenPost: (postId: number) => Promise<void>;
  closeCurrentPost: () => void;
  openCreateNewPost: () => void;
  sidebarStatus: SidebarStatus;
}>();
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <h2 class="title">Posts</h2>
          <button
            type="button"
            class="button is-link"
            :class="{ 'is-light': sidebarStatus === 'Post Adding' }"
            @click="openCreateNewPost()"
          >
            Add New Post
          </button>
        </div>

        <template v-if="posts.length === 0">
          <h3 class="mt-2 has-text-centered">No posts yet.</h3>
        </template>

        <template v-else>
          <table class="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
              <tr class="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <PostInfo
                v-for="post of posts"
                :post="post"
                :key="post.id"
                :chosenPost="chosenPost"
                :change-chosen-post="changeChosenPost"
                :close-current-post="closeCurrentPost"
              />
            </tbody>
          </table>
        </template>
      </div>
    </div>
  </div>
</template>

<style></style>
