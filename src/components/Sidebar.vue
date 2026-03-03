<template>
  <div class="column is-4-desktop Sidebar" :class="{ 'Sidebar--open': isOpen }">
    <div class="box is-success">
      <div class="content">
        <button type="button" class="delete" @click="$emit('close')"></button>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
defineEmits(["close"]);
</script>

<style scoped>
.Sidebar {
  display: none;
}

.Sidebar--open {
  display: block;
}

@media (min-width: 769px) {
  .Sidebar {
    display: block;
    overflow: hidden;
    max-width: 0;
    opacity: 0;
    transition: all 0.5s ease-in-out;
  }

  .Sidebar--open {
    max-width: 50%;
    opacity: 1;
  }
}

.delete {
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
}
</style>
