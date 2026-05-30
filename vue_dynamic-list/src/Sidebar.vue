<template>
  <div
    class="Sidebar"
    :class="{ 'Sidebar--open': isOpen }"
  >
    <div class="box">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
});
</script>

<style scoped>
.Sidebar {
  width: 0;
  opacity: 0;
  overflow: hidden;
  flex-shrink: 0;
  transition: all 0.4s ease-in-out;
}

.Sidebar--open {
  opacity: 1;
}

@media (min-width: 769px) {
  .Sidebar--open {
    width: calc(50% - 12px);
    overflow: visible;
  }
}
</style>
