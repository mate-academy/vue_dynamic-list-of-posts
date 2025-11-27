<script>
  export default {
    name: 'PostItem',
    props: {
      post: Object,
      selectedPost: Object,
    },
     emits: ["openPost", "closePost"],
  }
</script>

<template>
  <tr>
    <td>{{ post.id }}</td>
    <td>{{ post.title }}</td>
    <td class="has-text-right is-vcentered">
      <button
        type="button"
        class="button is-link"
        :class="{ 'is-light' : selectedPost.id !== post.id }"
        @click="
          selectedPost.id !== post.id
          ? $emit('openPost', post)
          : $emit('closePost')
        "
      >
        {{ selectedPost.id !== post.id? 'Open': 'Close' }}
      </button>
    </td>
  </tr>
</template>

<style></style>
