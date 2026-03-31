<script setup>
import AppLoader from './AppLoader.vue';

defineProps(['posts', 'selectedPostId', 'isLoading', 'hasError', 'isAddingActive']);
defineEmits(['toggle', 'add', 'retry']);
</script>

<template>
  <div class="box">
    <div class="level is-mobile mb-5">
      <div class="level-left"><h1 class="title is-4">Posts</h1></div>
      <div class="level-right">
        <button
          class="button is-link"
          :class="{ 'is-pressed': isAddingActive }"
          @click="$emit('add')"
        >
          Add New Post
        </button>
      </div>
    </div>

    <div v-if="hasError" class="notification is-danger">
      Failed to load posts. <button class="button is-small is-light ml-2" @click="$emit('retry')">Retry</button>
    </div>

    <AppLoader v-else-if="isLoading" />

    <div v-else-if="posts.length === 0" class="notification is-warning">
      No posts yet.
    </div>

    <table v-else class="table is-fullwidth">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th class="has-text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td>{{ post.id }}</td>
          <td>{{ post.title }}</td>
          <td class="has-text-right">
            <button class="button is-small"
                    :class="selectedPostId === post.id ? 'is-active-indigo' : 'is-link is-light'"
                    @click="$emit('toggle', post)">
              {{ selectedPostId === post.id ? 'Close' : 'Open' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
