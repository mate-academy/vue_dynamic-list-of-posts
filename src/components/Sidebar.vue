<script setup>
defineProps({
  isSidebarOpen: Boolean,
});
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isSidebarOpen }"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

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
