<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="is-flex is-justify-content-center is-align-items-center mt-2">
    <button type="button" class="button is-loading is-white">
      {{ label }}
    </button>
  </div>
</template>
