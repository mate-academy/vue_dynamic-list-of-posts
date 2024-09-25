<script setup>
const { selectedPost } = defineProps({
  selectedPost: {
    type: Object
  }
})

const emits = defineEmits(['deletePost'])
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ `#${selectedPost.id}: ${selectedPost.title}` }}</h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          @click="emits('deletePost', selectedPost.id)"
          class="icon is-small is-right has-text-danger is-clickable ml-3"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ selectedPost.body }}</p>
  </div>
</template>
