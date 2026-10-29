<script setup>
import { defineEmits, defineProps } from 'vue';
import Loader from './Loader.vue';

const props = defineProps({
  posts: Array,
  isSidebarOpen: Boolean,
  selectedPost: Object,
  isLoading: Boolean,
  postError: Boolean,
});

const emit = defineEmits(['open-sidebar', 'open-post']);
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
            :class="{ 'is-light': isSidebarOpen && !selectedPost }"
            @click="emit('open-sidebar')"
          >
            Add New Post
          </button>
        </div>

        <Loader v-if="isLoading" />
        <p v-else-if="postError" class="has-text-danger has-text-centered">
          Something went wrong. Please try again later.
        </p>
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
            <tr v-for="post of posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button 
                  type="button" 
                  class="button is-link"
                  :class="{ 'is-light': !selectedPost || selectedPost.id !== post.id }"
                  @click="emit('open-post', post)"
                >
                  {{ selectedPost && selectedPost.id === post.id ? 'Close' : 'Open'}}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <h3 class="mt-2 has-text-centered" v-else>No posts yet.</h3>
      </div>
    </div>
  </div>
</template>
