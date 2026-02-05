<script lang="ts">
import type { Post } from '@/types/Posts.type';

export default {
  name: 'postTable',

  props: {
    posts: {
      type: Array as () => Post[],
      required: true,
    },
    selectedPostId: {
      required: true,
    },
    togglePost: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      showpostDetail: false,
    };
  },
};
</script>

<template>
  <div class="table-wrapper">
    <table class="post-table">
      <colgroup class="colgroup">
        <col class="col-id" />
        <col class="col-title" />
        <col class="col-actions" />
      </colgroup>

      <thead>
        <tr>
          <th class="table-head table-head--left">ID</th>
          <th class="table-head table-head--left">Title</th>
          <th class="table-head table-head--right">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="post in posts" :key="post.id" class="table-row">
          <td class="table-cell table-cell--left">
            {{ post.id }}
          </td>

          <td class="table-cell table-cell--left">
            {{ post.title }}
          </td>

          <td class="table-cell table-cell--right">
            <button class="action-button" :class="{ 'action-button--close': selectedPostId === post.id }"
              @click="togglePost(post.id)">
              {{ selectedPostId === post.id ? 'Close' : 'Open' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
