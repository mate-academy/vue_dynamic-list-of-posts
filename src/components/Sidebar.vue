<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <div
    class="tile is-parent box is-6 Sidebar"
    :class="{ 'Sidebar--open': isOpen }"
  >
    <div class="tile is-child is-success">
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.Sidebar {
  width: 0;
  opacity: 0;
  max-width: 0;
  overflow: hidden;

  transition:
    width 0.5s ease-in-out,
    max-width 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
}

.Sidebar--open {
  width: 50%;
  max-width: 50%;
  opacity: 1;
}
</style>