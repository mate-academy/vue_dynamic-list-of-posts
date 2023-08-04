<script>
  export default {
    name: 'Post',
    props: {
      post: Object,
      previewId: Number,
    },
    emits: ['update-preview-id'],
  }
</script>

<template>
  <tbody>
    <tr>
      <td>{{ post.id }}</td>
      <td>{{ post.title }}</td>

      <td class="has-text-right is-vcentered">
        <button
          v-if="post.id === previewId"
          type="button"
          class="button is-link"
          @click="$emit('update-preview-id', 0)"
        >
          Close
        </button>

        <button
          v-else
          type="button"
          class="button is-link is-light"
          @click="$emit('update-preview-id', post.id)"
        >
          Open
        </button>
      </td>
    </tr>
  </tbody>
</template>