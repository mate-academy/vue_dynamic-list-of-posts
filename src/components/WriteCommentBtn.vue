<template>
  <button class="button is-primary" @click="$emit('write-comment')">
    Write a comment
  </button>
</template>

<script>
export default {
  name: "WriteCommentBtn",
  emits: ["write-comment"],
};
</script>
