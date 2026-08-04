<script setup>
import Loader from './Loader.vue';

defineProps({
  posts: {
    type: Array,
    required: true,
  },

  selectedPost: {
    type: Object,
    default: null,
  },

  isSidebarOpen: {
    type: Boolean,
    required: true,
  },

  isLoading: {
    type: Boolean,
    required: true,
  },

  errorMessage: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['add', 'open']);
</script>

<template>
  <div class="box app-box">
    <div class="block">
      <div class="block is-flex is-justify-content-space-between is-align-items-center">
        <p class="title">
          Posts
        </p>

        <button
          type="button"
          class="button is-link"
          @click="emit('add')"
        >
          Add New Post
        </button>
      </div>

      <Loader v-if="isLoading" />

      <div
        v-if="errorMessage"
        class="notification is-danger"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="!isLoading && !errorMessage && posts.length === 0"
        class="block has-text-centered no-posts"
      >
        No posts yet.
      </div>

      <table
        v-if="posts.length > 0"
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
            v-for="post of posts"
            :key="post.id"
          >
            <td>
              {{ post.id }}
            </td>

            <td>
              {{ post.title }}
            </td>

            <td class="has-text-right is-vcentered">
              <button
                type="button"
                class="button is-link"
                @click="emit('open', post)"
              >
                {{ selectedPost?.id === post.id && isSidebarOpen ? 'Close' : 'Open' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.app-box {
  min-height: 280px;
}

.no-posts {
  margin-top: 48px;
}
</style>