<script setup lang="ts">
const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button
    type="button"
    class="button is-link"
    @click="emit('click')"
  >
    Write a comment
  </button>
</template>