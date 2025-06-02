<template>
  <button type="button" class="button is-link" @click="$emit('writeComment')">
    Write a comment
  </button>
</template>

<script>
export default {
  emits: ["writeComment"] // Defines an event that the parent component can listen for
};
</script>

<style scoped>
.button {
  margin-top: 10px;
}
</style>
