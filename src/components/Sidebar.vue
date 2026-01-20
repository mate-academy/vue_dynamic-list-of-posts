<template>
  <div :class="['tile', 'is-parent', 'is-8-desktop', 'Sidebar', { 'Sidebar--open': isOpen }]">
    <div class="tile is-child box is-success">
      <div class="tile is-child box is-success">
        <div class="content">
          <slot></slot>
        </div>
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
      required: true
    }
  }
}
</script>
