<script setup>
import CommentsSection from './CommentsSection.vue';

defineProps({
  post: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>#{{ post.id }}: {{ post.title }}</h2>
      <div class="is-flex">
        <span
          @click="$emit('edit')"
          class="icon is-small is-right is-clickable"
          role="button"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          @click="$emit('delete')"
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          role="button"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ post.body }}</p>

    <hr />

    <CommentsSection :post-id="post.id" />
  </div>
</template>
