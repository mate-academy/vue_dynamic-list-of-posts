<template>
  <div :class="['tile is-parent is-8-desktop Sidebar', { 'Sidebar--open': isOpen }]">
    <div class="tile is-child box is-success">
      <button class="delete is-pulled-right" @click="$emit('close')"></button>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean
})
</script>

<style scoped>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition: max-width 0.5s ease-in-out, opacity 0.5s ease-in-out;
  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;
  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>
