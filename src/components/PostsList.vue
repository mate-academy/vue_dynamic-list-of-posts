<script setup>
import PostLoader from './PostLoader.vue';

defineProps({
  posts: { type: Array, required: true },
  selectedId: { type: Number, default: null },
  loading: Boolean,
  error: Boolean,
});

defineEmits(['open', 'add', 'retry']);
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="$emit('add')">
            Add New Post
          </button>
        </div>

        <PostLoader v-if="loading" />

        <div v-else-if="error" class="notification is-danger" data-cy="PostsLoadingError">
          Something went wrong while loading the posts.
          <button type="button" class="button is-small is-light ml-3" @click="$emit('retry')">
            Try again
          </button>
        </div>

        <div v-else-if="!posts.length" class="notification is-warning" data-cy="NoPostsYet">
          No posts yet
        </div>

        <table
          v-else
          class="table is-fullwidth is-striped is-hoverable is-narrow"
          data-cy="PostsTable"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="post in posts"
              :key="post.id"
              :class="{ 'has-background-link-light': post.id === selectedId }"
            >
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': post.id !== selectedId }"
                  @click="$emit('open', post)"
                >
                  {{ post.id === selectedId ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
