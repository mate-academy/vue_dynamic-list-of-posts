<script setup lang="ts">
import type { Post } from "../types/Post";

defineProps<{
  post: Post;
  isDeleting: boolean;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div class="block">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center"
    >
      <h2>#{{ post.id }}: {{ post.title }}</h2>

      <div class="is-flex">
        <span
          class="icon is-small is-right is-clickable"
          role="button"
          tabindex="0"
          aria-label="edit post"
          @click="emit('edit')"
          @keydown.enter="emit('edit')"
          @keydown.space.prevent="emit('edit')"
        >
          <i class="fas fa-pen-to-square" />
        </span>

        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          role="button"
          tabindex="0"
          aria-label="delete post"
          @click="emit('delete')"
          @keydown.enter="emit('delete')"
          @keydown.space.prevent="emit('delete')"
        >
          <i class="fas fa-trash" />
        </span>
      </div>
    </div>

    <p data-cy="PostBody">
      {{ post.body }}
    </p>
    <p
      v-if="isDeleting"
      class="help is-info mt-2"
    >
      Deleting...
    </p>
  </div>
</template>