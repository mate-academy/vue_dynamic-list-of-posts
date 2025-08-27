<template>
  <div class="box">
    <h3 class="title is-4">{{ post.title }}</h3>
    <p>{{ post.body }}</p>
    <div class="buttons mt-3">
      <button class="button is-small is-warning" @click="$emit('edit', post)">
        Edit
      </button>
      <button class="button is-small is-danger" @click="$emit('delete', post)">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostPreview",
  props: {
    post: Object,
  },
};
</script>
