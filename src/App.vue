<script setup lang="ts">
import { ref } from 'vue';

import Header from './components/layout/Header.vue';
import PostsList from './components/posts/PostsList.vue';
import AddPost from './components/posts/AddPost.vue';

import type { Post } from './types/Post';

const user = ref({
  id: 1,
  name: 'Uttdg',
});

const posts = ref<Post[]>([]);

const isCreatingPost = ref(false);

const openCreatePost = () => {
  isCreatingPost.value = true;
};
</script>

<template>
  <Header :user="user" />

  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        
        <div 
          class="tile is-parent"
          :class="{ 'is-8': isCreatingPost }"
        >
          <div class="tile is-child box">
            <div class="block is-flex is-justify-content-space-between is-align-items-center">
              <h1 class="title has-text-weight-medium">Posts</h1>

              <button
                v-if="!isCreatingPost"
                type="button"
                class="button is-link"
                @click="openCreatePost"
              >
                Add New Post
              </button>
            </div>

            <PostsList :posts="posts" />
          </div>
        </div>

        <div
          v-if="isCreatingPost"
          class="tile is-parent is-4"
        >
          <div class="tile is-child box">
            <AddPost @close="isCreatingPost = false" />
          </div>
        </div>

      </div>
    </div>
  </main>
</template>