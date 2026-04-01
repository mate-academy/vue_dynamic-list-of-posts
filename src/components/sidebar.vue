<script setup lang="ts">
import PostPreview from './postPreview.vue';
import AddPost from './addPost.vue';
import { Post } from '../types/Post';
import '../App.scss';

defineProps<{
  selectedPost: Post | null;
  isAdding: boolean;
  userId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'post-added', post: Post): void
  (e: 'delete', postId: number): void
  (e: 'edit', post: Post): void
}>();
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': selectedPost || isAdding }"
  >
    <div class="tile is-child box is-success">
      
        <div class="content">
          <AddPost
            v-if="isAdding"
            :userId="userId"
            @added="(post) => emit('post-added', post)"
            @cancel="emit('close')"
          />
          <PostPreview
            v-else-if="selectedPost"
            :post="selectedPost"
            @close="emit('close')"
            @delete="(id) => emit('delete', id)"
            @edit="(post) => emit('edit', post)"
          />
        </div>
      </div>
    </div>

</template>

