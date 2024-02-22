<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import type { Post } from '@/types/Post';

  export default defineComponent({
    props: {
      post: {
        type: Object as PropType<Post>,
        required: true,
      }
    }
  })
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button type="button" class="button is-link">Open</button>
    </td>
  </tr>
</template>
