<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isOpen }">
    <div v-if="isOpen" class="tile is-child box is-success">
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  max-width: 0;
  padding: 0 !important;
  transition-property: max-width, opacity, padding;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

.Sidebar--open {
  opacity: 1;
  padding: 0.75rem !important;
}

@media (min-width: 769px) {
  .Sidebar--open {
    max-width: 50%;
  }
}

@media (max-width: 768px) {
  .Sidebar--open {
    max-width: 100%;
  }
}
</style>
