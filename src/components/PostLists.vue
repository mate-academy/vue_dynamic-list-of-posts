<script setup>
import Loader from './Loader.vue'

const props = defineProps({
  posts: Array,
  loading: Boolean,
  error: Boolean,
  selectedPost: Object,
})

const emit = defineEmits([
  'open-post',
  'create-post',
  'close-post',
])
</script>

<template>
  <div class="tile is-parent is-4-desktop">
    <div class="tile is-child box">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-4"
      >
        <h2 class="title is-4 mb-0">
          Posts
        </h2>

        <button
          class="button is-link"
          @click="emit('create-post')"
        >
          Add New Post
        </button>
      </div>

      <!-- LOADER -->
      <Loader v-if="loading" />

      <!-- ERROR -->
      <div
        v-else-if="error"
        class="notification is-danger"
      >
        Failed to load posts
      </div>

      <!-- POSTS -->
      <table
        v-else-if="posts.length"
        class="table is-fullwidth is-striped is-hoverable"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th class="has-text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
          >
            <td>{{ post.id }}</td>

            <td class="has-text-weight-medium">
              {{ post.title }}
            </td>

            <td class="has-text-right">
              <button
                v-if="selectedPost && selectedPost.id === post.id"
                class="button is-link is-small"
                @click="emit('close-post')"
              >
                Close
              </button>

              <button
                v-else
                class="button is-link is-small"
                @click="emit('open-post', post)"
              >
                Open
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- EMPTY -->
      <div
        v-else
        class="has-text-centered p-4"
      >
        No posts yet
      </div>
    </div>
  </div>
</template>