<script setup lang="ts">
import type { Comment } from "../types/Comment";
import Loader from "./loader/Loader.vue";

defineProps<{
  comment: Comment;
  deleting: number | null;
}>();

const emit = defineEmits<{
  delete: [comment: Comment];
}>();
</script>

<template>
  <Loader v-if="deleting && deleting === comment.id"></Loader>
  <article v-else class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="() => $emit('delete', comment)"
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
