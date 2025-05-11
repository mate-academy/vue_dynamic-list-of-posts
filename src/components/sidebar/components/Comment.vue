<script setup>
import { deleteComment } from "@/api/comments";
const { comment } = defineProps(["comment"]);
const { email, name, body, id } = comment;

const emit = defineEmits(["delete"]);
const handleDelete = async () => {
  try {
    await deleteComment(id);
    emit("delete");
  } catch {}
};
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${email}`"> {{ name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="handleDelete"
      >
        delete button
      </button>
    </div>
    <div class="message-body">{{ body }}</div>
  </article>
</template>
