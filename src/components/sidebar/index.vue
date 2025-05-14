<script setup>
const { isOpen } = defineProps(['isOpen']);
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isOpen }">
    <div class="tile is-child box is-success ">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style src="./index.css" scoped></style>
