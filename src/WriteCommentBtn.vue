<template>
  <button class="button is-link is-light" @click="$emit('click')">
    Write a comment
  </button>
</template>

<script>
export default {
  name: "WriteCommentBtn",
};
</script>
