<script setup lang="ts">
import type { Post } from "../../types/Post";

defineProps<{
  posts: Post[];
}>();
</script>

<template>
  <table 
    v-if="posts.length > 0"
    class="table is-fullwidth is-striped is-hoverable is-narrow"
  >
    <thead>
      <tr class="has-background-link-light">
        <th>ID</th>
        <th>Title</th>
        <th class="has-text-right">Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="post in posts" :key="post.id">
        <td>{{ post.id }}</td>
        <td>{{ post.title }}</td>
        <td class="has-text-right is-vcentered">
          <button type="button" class="button is-link">Open</button>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-else class="content has-text-centered">
    <p>No posts yet.</p>
  </div>
</template>