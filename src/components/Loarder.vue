<template>
  <div class="has-text-centered py-4" role="status" aria-live="polite">
    <button class="button is-loading is-white" disabled>Loading</button>
    <p class="mt-2">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "Loading...",
  },
});
</script>
