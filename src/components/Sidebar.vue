<template>
  <aside :class="['Sidebar', { 'Sidebar--open': isOpen }]">
    <slot />
  </aside>
</template>

<script setup>
defineProps({ isOpen: Boolean });
</script>
