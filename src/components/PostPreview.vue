<template>
  <div class="block">
    <div class="block is-flex is-justify-content-space-between ">
      <h2 class="has-text-weight-semibold is-size-3">#{{ post.id }}: {{ post.title }} </h2>
      <div class="is-flex">
        <span class="icon is-small is-clickable" @click="$emit('edit', post)">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span class="icon is-small has-text-danger is-clickable ml-3" @click="$emit('delete', post.id)">
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p>{{ post.body }}</p>
  </div>
</template>

<script setup>
defineProps({ post: Object })
</script>

<style scoped></style>