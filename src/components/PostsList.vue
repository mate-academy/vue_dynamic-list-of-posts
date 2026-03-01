<script setup lang="ts">
import type { Post } from "../types/Post";
import PostLoader from "./PostLoader.vue";

const props = defineProps<{
  posts: Post[];
  isLoading: boolean;
  error: string | null;

  selectedPostId: number | null;
  isSidebarOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "open", post: Post): void;
  (e: "create"): void;
}>();

function isActive(postId: number) {
  return props.selectedPostId === postId;
}
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">
            Posts
          </p>

          <button
            class="button is-link"
            type="button"
            @click="emit('create')"
          >
            Add New Post
          </button>
        </div>

        <PostLoader v-if="isLoading" />

        <div
          v-else-if="error"
          class="notification is-danger"
        >
          {{ error }}
        </div>

        <div
          v-else-if="posts.length === 0"
          class="notification is-warning"
        >
          No posts yet
        </div>

        <table
          v-else
          class="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="p in posts"
              :key="p.id"
              :class="{ 'has-background-link-light': isActive(p.id) }"
              style="cursor: pointer"
              @click="emit('open', p)"
            >
              <td>{{ p.id }}</td>
              <td>{{ p.title }}</td>

              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  @click.stop="emit('open', p)"
                >
                  {{ isActive(p.id) ? "Close" : "Open" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
