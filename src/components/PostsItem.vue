<script setup>
const props = defineProps({
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
    <td>{{ props.post.id }}</td>
    <td>{{ props.post.title }}</td>
    <td className="has-text-right is-vcentered">
      <button
        type="button"
        class="button is-link"
        :class="{ 'is-light': props.selectedPost.id !== props.post.id }"
        @click="
          props.selectedPost.id === props.post.id
            ? emits('deselectPost')
            : emits('selectPost', props.post)
        "
      >
        {{ props.selectedPost.id === props.post.id ? 'Close' : 'Open' }}
      </button>
    </td>
  </tr>
</template>
