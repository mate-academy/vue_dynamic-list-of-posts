<script setup>
import PostLoader from './PostLoader.vue';

defineProps({
  posts: {
    type: Array,
    required: true,
  },
  isLoading: { type: Boolean, default: false },
  hasError: { type: Boolean, default: false },
  selectedPostId: { type: Number, default: null },
  isSidebarOpen: { type: Boolean, default: false },
});

defineEmits(['open-post', 'add-post']);
</script>

<template>

  <div class="tile is-child box is-success">
    <div class="block">
      <div class="block is-flex is-justify-content-space-between">
        <p class="title">Posts</p>
        <button
          type="button"
          class="button is-link"
          @click="$emit('add-post')"
          :class="{ 'is-light': isSidebarOpen }"
        >
          Add New Post
        </button>
      </div>

      <PostLoader v-if="isLoading" />

      <div v-else-if="hasError" class="notification is-danger">
          Something went wrong!
        </div>

      <table
        v-else-if="posts.length > 0"
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
              <button
                type="button"
                class="button is-link"
                :class="{ 'is-light': selectedPostId !== post.id }"
                @click="$emit('open-post', post)"
              >
                {{ selectedPostId === post.id ? 'Close' : 'Open' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 v-else class="mt-2 has-text-centered">
          No posts yet.

      </h3>

    </div>
  </div>

</template>



