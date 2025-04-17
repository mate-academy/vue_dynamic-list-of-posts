<script>
export default {
  name: 'Sidebar',
};
</script>


<template>
  <div class="tile is-parent is-8-desktop Sidebar">
    <div class="tile is-child box is-success">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>


<style scoped>
.sidebar {
  overflow: hidden;
  opacity: 0;
  transition: max-width 0.5s ease-in-out, opacity 0.5s ease-in-out;
  max-width: 0;
}
.sidebar--open {
  opacity: 1;
  max-width: 50%;
}
@media (max-width: 768px) {
  .sidebar--open {
    max-width: 100%;
  }
}
</style>
