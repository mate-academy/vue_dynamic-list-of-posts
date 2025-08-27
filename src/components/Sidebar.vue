<template>
  <div class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': open }">
    <div class="tile is-child box">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({ open: Boolean })
</script>

<style scoped>
.Sidebar { overflow: hidden; opacity: 0; max-width: 0; transition: max-width 0.5s, opacity 0.5s; }
.Sidebar--open { opacity: 1; max-width: 50%; }
</style>