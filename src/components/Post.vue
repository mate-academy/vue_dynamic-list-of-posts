<script>
export default {
  name: 'Post',
  props: {
    post: {
      type: Object,
      required: true,
    },
    currentPostId: {
      type: Number,
      required: true,
    },
  },
  emits: ['openSidebar'],
};
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
        :class="['button', 'is-link', { 'is-light': post.id !== currentPostId }]"
        @click="$emit('openSidebar', post.id)"
      >
        {{ post.id !== currentPostId ? 'Open' : 'Close' }}
      </button>
    </td>
  </tr>
</template>
