<script setup>
import Loader from "./Loader.vue";

defineProps({
  posts: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  selectedPostId: { type: [Number, String], default: null },
  error: { type: String, default: "" },
});

const emit = defineEmits(["add-post", "open-post"]);
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
            @click="emit('add-post')"
          >
            Add New Post
          </button>
        </div>

        <Loader v-if="isLoading" />
        <div
          v-else-if="error"
          class="notification is-danger"
          data-cy="PostsLoadingError"
        >
          {{ error }}
        </div>

        <p v-else-if="posts.length === 0" class="has-text-centered">
          No posts yet.
        </p>

        <table
          v-else
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
                  class="button"
                  :class="
                    post.id === selectedPostId ? 'is-link' : 'is-link is-light'
                  "
                  @click="emit('open-post', post.id)"
                >
                  {{ post.id === selectedPostId ? "Close" : "Open" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
