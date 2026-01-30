<script>
export default {
  name: "Sidebar",
  props: {
    isSidebarOpen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <div
    class="column is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isSidebarOpen }"
  >
    <div class="tile is-child box is-success">
      <div class="tile is-child box is-success">
        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

.Sidebar--open {
  opacity: 1;
}

@media (min-width: 769px) {
  .Sidebar {
    max-width: 0;
  }

  .Sidebar--open {
    max-width: 50%;
  }
}
</style>
