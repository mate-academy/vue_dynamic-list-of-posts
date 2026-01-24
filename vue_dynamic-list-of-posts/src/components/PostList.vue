<script setup>
import { defineProps, defineEmits } from 'vue';
import Loader from './Loader.vue';

const props = defineProps({
  posts: { type: Array, default: () => [] }, userId: [Number, String],
  isLoading: { type: Boolean, default: false }, errorMessage: { type: String },
  selectedPost: Object
});
const emit = defineEmits(['open-sidebar', 'close']);
</script>
<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="emit('open-sidebar', { mode: 'create' })">Add New
            Post</button>
        </div>

        <Loader v-if="isLoading" />

        <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>

        <p class="text has-text-centered" v-if="posts.length === 0">No posts yet</p>

        <table class="table is-fullwidth is-striped is-hoverable is-narrow" v-else>
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
                <button type="button" class="button is-link" v-if="post.id === selectedPost?.id"
                  @click="emit('close')">Close</button>
                <button type="button" class="button is-link" v-else
                  @click="emit('open-sidebar', { mode: 'view', post })">Open</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
