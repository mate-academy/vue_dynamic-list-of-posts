<script lang="ts">
import { defineComponent } from 'vue'
import Loader from '../Loader/DataLoader.vue'
import type { Post } from '../../api/posts'

export default defineComponent({
  components: { Loader },

  props: {
    posts: {
      type: Array as () => Post[],
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    selectedPostId: {
      type: Number as () => number | null,
      default: null,
    },
  },

  emits: ['select-post', 'add-new-post'],
})
</script>

<template>
  <div class="box is-success" style="height: 100%">
    <div class="block">
      <div class="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <p class="title">Posts</p>
        <button type="button" class="button is-link" @click="$emit('add-new-post')">
          Add New Post
        </button>
      </div>

      <Loader v-if="isLoading" />

      <div v-else-if="hasError" class="notification is-danger">
        Something went wrong. Please try again.
      </div>

      <div v-else-if="posts.length === 0" class="notification is-warning">No posts yet.</div>

      <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
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
            :class="{ 'is-selected': post.id === selectedPostId }"
          >
            <td>{{ post.id }}</td>
            <td>{{ post.title }}</td>
            <td class="has-text-right is-vcentered">
              <button
                type="button"
                class="button is-link"
                :class="{ 'is-light': post.id !== selectedPostId }"
                @click="$emit('select-post', post)"
              >
                {{ post.id === selectedPostId ? 'Close' : 'Open' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
