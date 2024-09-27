<script setup lang="ts">
import { Post } from "../../../types/post";
import PostInfo from "./PostInfo.vue";

defineProps<{
  posts: Post[];
}>();
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div className="block">
        <div className="block is-flex is-justify-content-space-between">
          <h2 className="title">Posts</h2>
          <button type="button" className="button is-link">Add New Post</button>
        </div>

        <template v-if="posts.length === 0">
          <h3 class="mt-2 has-text-centered">No posts yet.</h3>
        </template>

        <template v-else>
          <table className="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
              <tr className="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th className="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <PostInfo v-for="post of posts" :post="post" :key="post.id" />
            </tbody>
          </table>
        </template>
      </div>
    </div>
  </div>
</template>

<style></style>
