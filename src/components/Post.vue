<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import type { Post } from '@/types/Post';

  export default defineComponent({
    props: {
      post: {
        type: Object as PropType<Post>,
        required: true,
      },
      postId: Number,
    },
    emits: ['choosePost']
  })
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
        class="button is-link"
        :class="{'is-light': post.id !== postId}"
        @click="$emit('choosePost', post.id)"
      >
        {{ post.id === postId ? 'Close' : 'Open' }}
      </button>
    </td>
  </tr>
</template>
