<template>
  <div class="box">
    <h2 class="title is-4">{{ post.title }}</h2>
    <p class="subtitle is-6">{{ post.body }}</p>

    <div class="buttons mt-4">
      <button class="button is-warning" @click="$emit('edit', post)">Edit</button>
      <button class="button is-danger" @click="$emit('delete', post.id)">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostPreview',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.box {
  padding: 1.5rem;
}
</style>
