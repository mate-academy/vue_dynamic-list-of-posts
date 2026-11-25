<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '@/types/Post';

interface Props {
  posts: Post[];
  selectedPostId: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  select: [postId: number | null];
  'add-new': [];
}>();

const showNoPosts = computed(
  () => props.posts.length === 0
);

const showPostsList = computed(
  () => props.posts.length > 0
);
</script>

<template>
  <div data-cy="PostsList">
    <div class="block is-flex is-justify-content-space-between">
      <p class="title">Posts</p>
      <button type="button" class="button is-link" @click="emit('add-new')">
        Add New Post
      </button>
    </div>

    <div v-if="showNoPosts" class="notification is-warning" data-cy="NoPostsYet">
      No posts yet
    </div>

    <table v-if="showPostsList" class="table is-fullwidth is-striped is-hoverable is-narrow">
      <thead>
        <tr class="has-background-link-light">
          <th>ID</th>
          <th>Title</th>
          <th class="has-text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="post in props.posts" :key="post.id" data-cy="Post">
            <td data-cy="PostId">{{ post.id }}</td>
            <td data-cy="PostTitle">{{ post.title }}</td>
            <td class="has-text-right is-vcentered">
              <button
                type="button"
                data-cy="PostButton"
                :class="['button is-link', { 'is-light': props.selectedPostId !== post.id }]"
                @click="emit('select', props.selectedPostId === post.id ? null : post.id)"
              >
                {{ props.selectedPostId === post.id ? 'Close' : 'Open' }}
              </button>
            </td>
          </tr>
        </tbody>
    </table>
  </div>
</template>