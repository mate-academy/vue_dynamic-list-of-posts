<template>
  <div>
    <div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
      <h2 class="title is-4">Posts</h2>
      <button class="button is-primary" @click="$emit('create')">Create new post</button>
    </div>

    <div v-if="loading"><Loader /></div>
    <Notification v-else-if="error" :message="error" @close="$emit('clear-error')" />

    <div v-else>
      <div v-if="!posts.length" class="notification is-info">No posts yet</div>
      <table v-else class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id" class="PostRow">
            <td>{{ post.id }}</td>
            <td class="clickable" @click="$emit('select', post.id)">{{ post.title }}</td>
            <td>
              <div class="buttons are-small">
                <button class="button is-info" @click="$emit('edit', post.id)">Edit</button>
                <button class="button is-danger" @click="$emit('delete', post.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import Loader from './Loader.vue';
import Notification from './Notification.vue';

defineProps({ posts: Array, loading: Boolean, error: String });
</script>
