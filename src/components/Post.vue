<script>
  export default {
    name: 'Post',
    props: {
      post: Object,
      previewId: Number,
      isPreview: Boolean,
    },
    emits: ['setPreviewId', 'setIsPreview'],
  }
</script>

<template>
  <tbody>
    <tr>
      <td>{{ post.id }}</td>
      <td>{{ post.title }}</td>
      <td class="has-text-right is-vcentered">
        <button
          v-if="post.id === previewId && isPreview"
          type="button"
          class="button is-link"
          @click="$emit('setIsPreview', false)"
        >
          Close
        </button>
        <button
          v-else
          type="button"
          class="button is-link is-light"
          @click="$emit('setPreviewId', post.id); $emit('setIsPreview', true)"
        >
          Open
        </button>
      </td>
    </tr>
  </tbody>
</template>