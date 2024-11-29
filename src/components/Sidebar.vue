<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  isOpen: Boolean,
});
</script>

<template>
  <div
    class="tile is-parent is-8-desktop Sidebar"
    :class="{ 'Sidebar--open': isOpen }"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
