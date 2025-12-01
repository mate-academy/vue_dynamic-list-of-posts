<script setup>
import PostListItem from './PostListItem.vue'
import Loader from './Loader.vue'

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
  isFormOpen: {
    type: Boolean,
    required: true,
  },
  currentPostId: {
    type: [Number, null],
    required: true,
  },
})

const isLoading = defineModel('isLoading', {
  type: Boolean,
})

const emit = defineEmits(['viewPost', 'createPost'])
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
            :class="{ 'is-light': props.isFormOpen }"
            @click="emit('createPost')"
          >
            Add New Post
          </button>
        </div>

        <h3
          class="mt-2 has-text-centered"
          data-cy="NoPostsYet"
          v-if="props.posts.length === 0 && !isLoading"
        >
          No posts yet
        </h3>

        <Loader v-else-if="isLoading" />

        <table
          class="table is-fullwidth is-striped is-hoverable is-narrow"
          v-if="props.posts.length > 0"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <PostListItem
              v-for="post of props.posts"
              :key="post.id"
              :post="post"
              :is-current-post="currentPostId === post.id"
              @viewPost="emit('viewPost', post)"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style></style>
