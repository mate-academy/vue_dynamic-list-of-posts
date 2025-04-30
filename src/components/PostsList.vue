<script setup>
  import { SIDEBAR_MODES } from '@/utils/sidebarModes';
  import PostItem from './PostItem.vue';

  defineProps({
    posts: {
      type: Array,
      required: true,
    },
  });

  const currentPostId = defineModel('currentPostId', { type: Number });
  const sidebarMode = defineModel('sidebarMode', { type: String });
  const title = defineModel('title', { type: String });
  const body = defineModel('body', { type: String });

  const openNewPostForm = () => {
    currentPostId.value = null;
    sidebarMode.value = SIDEBAR_MODES.NEW_POST_FORM;

    title.value = '';
    body.value = '';
  };
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>

          <button
            type="button"
            :class="{ 'is-light': sidebarMode === SIDEBAR_MODES.NEW_POST_FORM }"
            class="button is-link"
            @click="openNewPostForm"
          >
            Add New Post
          </button>
        </div>

        <h3 v-if="posts.length === 0" class="mt-2 has-text-centered">No posts yet.</h3>

        <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <PostItem
              v-for="post of posts"
              :key="post.id"
              v-model:current-post-id="currentPostId"
              v-model:sidebar-mode="sidebarMode"
              :post="post"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
