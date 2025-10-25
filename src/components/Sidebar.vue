<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();
</script>

<template>
  <div
    class="Sidebar"
    :class="{ 'Sidebar--open': isOpen }"
  >
    <div class="box is-success">
        <div class="block">
          <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.Sidebar {
  width: 100%;
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }

  &--open {
    opacity: 1;

    @media (min-width: 769px) {
      max-width: 50%;
    }
  }
}
</style>
