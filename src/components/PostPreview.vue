<script>
export default {
  name: "PostPreview",
  props: {
    post: Object,
    deletePost: Function,
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],
};
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#post {{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span
          @click="$emit('update:modelValue', true)"
          class="icon is-small is-right is-clickable"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          @click="deletePost(post.id)"
          class="icon is-small is-right has-text-danger is-clickable ml-3"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>
  </div>
</template>
