<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  isCurrentPost: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['viewPost'])
</script>

<template>
  <tr>
    <td>{{ props.post.id }}</td>
    <td>{{ props.post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
        class="button is-link"
        :class="{ 'is-light': !props.isCurrentPost }"
        @click="emit('viewPost')"
      >
        {{ props.isCurrentPost ? 'Close' : 'Open' }}
      </button>
    </td>
  </tr>
</template>

<style></style>
