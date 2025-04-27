<template>
  <div class="block">
    <div class="block is-flex is-justify-content-space-between">
      <p class="title">Posts</p>
      <button type="button" class="button is-link" @click="emit('create-post')">
        Add New Post
      </button>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="error" class="notification is-danger">Failed to load posts</p>
    <p v-else-if="!posts.length" class="title is-4">No posts yet</p>
    <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
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
              class="button is-link"
              @click="emit('open-post', post)"
            >
              Open
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps(['posts', 'loading', 'error']);
const emit = defineEmits(['open-post', 'create-post']);
</script>