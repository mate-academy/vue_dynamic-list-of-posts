<script>
import LoaderSpinner from '../components/LoaderSpinner.vue'
import { Sidebar } from '../types/types'

export default {
  name: 'PostsTable',
  components: {
    LoaderSpinner
  },
  props: {
    sidebar: Sidebar,
    isLoading: Boolean,
    posts: Array,
    currentPost: Object
  },
  emits: ['sidebarSetAddPost', 'openPost'],
  methods: {
    sidebarSetAddPost() {
      this.$emit('sidebarSetAddPost')
    }
  },
  data() {
    return {
      Sidebar
    }
  }
}
</script>

<template>
  <div class="block">
    <div class="block is-flex is-justify-content-space-between">
      <p class="title">Posts</p>

      <button
        type="button"
        class="button is-link"
        :class="{ 'is-light': sidebar === Sidebar.addPost }"
        @click="sidebarSetAddPost"
      >
        Add New Post
      </button>
    </div>

    <LoaderSpinner v-if="isLoading" />

    <table v-if="posts.length > 0" class="table is-fullwidth is-striped is-hoverable is-narrow">
      <thead>
        <tr class="has-background-link-light">
          <th>ID</th>
          <th>Title</th>
          <th class="has-text-right">Actions</th>
        </tr>
      </thead>
      <tbody
        v-for="{ id, title, ...rest } in posts"
        :key="id"
      >
        <tr>
          <td>{{ id }}</td>
          <td>{{ title }}</td>
          <td class="has-text-right is-vcentered">
            <button
              type="button"
              class="button is-link"
              :class="{ 'is-light': currentPost.id !== id }"
              @click="$emit('openPost', { id, title, rest })"
            >
              {{ currentPost.id === id ? 'Close' : 'Open' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3
      v-if="!isLoading && !posts.length"
      class="mt-2 has-text-centered"
    >
      No posts yet.
    </h3>
  </div>
</template>

<style></style>
