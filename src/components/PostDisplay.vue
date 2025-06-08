<script>
export default {
  name: 'PostDisplay',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  emits: ['editPost', 'deletePost'],
};
</script>

<template>
  <div class="box">
    <h3 class="title is-3">{{ post.title }}</h3>
    <p>{{ post.body }}</p>
    <div class="buttons mt-4">
      <button class="button is-link" @click="$emit('editPost', post)">
        Edit
      </button>
      <button
        class="button is-danger is-light"
        @click="$emit('deletePost', post.id)"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped></style>
