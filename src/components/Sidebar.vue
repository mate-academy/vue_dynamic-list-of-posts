<script>
export default {
  name: 'Sidebar',

  props: {
    isOpen: Boolean,
  },
};
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isOpen }"
    role="complementary"
    :aria-hidden="!isOpen"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <slot></slot>
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

@media (min-width: 769px) {
  .Sidebar {
    max-width: 0;
  }

  .Sidebar--open {
    max-width: 50%;
  }
}

.Sidebar--open {
  opacity: 1;
}
</style>
