<script setup>
const { post, selectedPost } = defineProps({
  post: {
    type: Object
  },
  selectedPost: {
    type: Object
  }
})

const emits = defineEmits(['selectPost', 'deselectPost'])
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
        class="button is-link"
        :class="{ 'is-light': selectedPost.id !== post.id }"
        @click="selectedPost.id === post.id ? emits('deselectPost') : emits('selectPost', post)"
      >
        {{ selectedPost.id === post.id ? 'Close' : 'Open' }}
      </button>
    </td>
  </tr>
</template>
