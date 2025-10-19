<template>
  <section class="section">
    <div class="container">
      <h1 class="title">My Posts</h1>

      <Loader v-if="isLoading" />

      <div v-else-if="hasError" class="notification is-danger">
        Failed to load posts. Please try again.
      </div>

      <div v-else-if="!posts.length" class="notification is-info">
        No posts yet.
      </div>

      <table v-else class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>{{ post.title }}</td>
            <td>{{ post.body }}</td>
            <td class="has-text-right">
              <button
                class="button is-small is-info"
                @click="$emit('open', post)"
              >
                Open
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="has-text-right">
        <button
          class="button is-primary mt-3"
          @click="$emit('create')"
        >
          + Create new post
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '../api/api';
import Loader from './Loader.vue';

const posts = ref([]);
const isLoading = ref(false);
const hasError = ref(false);

onMounted(async () => {
  await loadPosts();
});

async function loadPosts() {
  isLoading.value = true;
  hasError.value = false;

  try {
    const data = await get('/posts');
    posts.value = data.slice(0, 10); 
  } catch {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}
</script>
