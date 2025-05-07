<template>
  <p v-if="comments.length === 0" className="title is-4">No comments yet</p>
  <div v-else>
    <article
      v-for="comment in comments"
      :key="comment.commentID"
      class="message is-small"
    >
      <div class="message-header">
        <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
        <button
          type="button"
          class="delete is-small"
          aria-label="delete"
          @click="$emit('deleteComment', comment.commentID)"
        ></button>
      </div>
      <div class="message-body">
        {{ comment.body }}
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Comment } from '@/types/Comment'

const props = defineProps<{
  comments: Comment[]
}>()

const emit = defineEmits(["deleteComment"]);
</script>

<style scoped></style>
