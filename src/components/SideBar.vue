<script setup>
import PostPreview from '../components/PostPreview.vue'

const props = defineProps(['activePost'])
const emit = defineEmits(['delete', 'edit'])
</script>

<template>
  <div :class="['SideBar', { 'Sidebar--open': props.activePost?.id }]">
    <div class="tile is-child box is-success">
      <div class="content">
        <PostPreview
          :post="props.activePost"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.SideBar {
  overflow: hidden;
  /* opacity: 0; */
  display: none;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  /* opacity: 1; */
  display: block;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>
