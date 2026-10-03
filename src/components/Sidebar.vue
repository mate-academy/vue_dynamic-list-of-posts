<script>
export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isOpen }">
    <div class="tile is-child box is-success">
      <div class="tile is-child box is-success">
        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
