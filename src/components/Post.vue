<script>
export default {
  name: 'Article',
  props: {
    item: {
      type: Object,
      required: true,
    },
    activePostId: {
      type: Number,
      required: true,
    },
  },
  emits: ['toggleSidebar'],
};
</script>

<template>
  <tr>
    <td>{{ item.id }}</td>
    <td>{{ item.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
        :class="['button', 'is-link', { 'is-light': item.id !== activePostId }]"
        @click="$emit('toggleSidebar', item.id)"
      >
        {{ item.id !== activePostId ? 'Open' : 'Close' }}
      </button>
    </td>
  </tr>
</template>
