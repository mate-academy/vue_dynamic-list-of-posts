<script>
export default {
  name: "WriteCommentBtn",
  emits: ["update:modelValue"],
  props: {
    modelValue: Boolean,
  },
};
</script>

<template>
  <button
    @click="$emit('update:modelValue', true)"
    type="button"
    class="button is-link"
  >
    Write a comment
  </button>
</template>
