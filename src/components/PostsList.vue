<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            @click="$emit('new-post')"
          >
            Add New Post
          </button>
        </div>

        <AppLoader v-if="loading" />

        <div v-else-if="error" class="notification is-danger is-light">
          <button class="delete" @click="$emit('reload')"></button>
          Something went wrong. Please try again.
        </div>

        <div v-else-if="!posts.length" class="notification is-warning is-light">
          No posts yet
        </div>

        <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>#</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="post in posts"
              :key="post.id"
              :class="{ 'has-background-link-light': selectedPostId === post.id }"
            >
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': selectedPostId === post.id }"
                  @click="$emit('select-post', post)"
                >
                  {{ selectedPostId === post.id ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppLoader from './AppLoader.vue'

defineProps({
  posts: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  selectedPostId: { type: Number, default: null },
})
defineEmits(['new-post', 'select-post', 'reload'])
</script>
