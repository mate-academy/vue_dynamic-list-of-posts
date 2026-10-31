<script setup>
import CommentsSection from './CommentsSection.vue';
import PostPreview from './PostPreview.vue';

defineProps({
  post: { type: Object, required: true },
  error: { type: String, default: '' },
});

defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="content" data-cy="PostDetails">
    <PostPreview :post="post" @edit="$emit('edit')" @delete="$emit('delete')" />

    <p v-if="error" class="notification is-danger is-light" data-cy="PostDeleteError">
      {{ error }}
    </p>

    <CommentsSection :post-id="post.id" />
  </div>
</template>
