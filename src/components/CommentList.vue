<script setup>
import PostLoader from './PostLoader.vue';

defineProps({
  comments: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
  hasError: { type: Boolean, default: false },
});

defineEmits(['delete-comment']);
</script>

<template>

    <PostLoader v-if="isLoading" />

    <div v-else-if="hasError" class="notification is-danger">
      Something went wrong!
    </div>

    <template v-else>
      <div v-if="comments.length === 0" class="block">
        <p class="title is-4">No comments yet</p>
      </div>

      <article
        v-for="comment in comments"
        :key="comment.id"
        class="message is-small">
        <div class="message-header">
          <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
          <button
            type="button"
            class="delete is-small"
            aria-label="delete"
            @click="$emit('delete-comment', comment.id)" />
        </div>
        <div class="message-body">{{ comment.body }}</div>
      </article>
    </template>

</template>

