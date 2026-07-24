<script setup>
const props = defineProps({
  comments: Array,
});

const emit = defineEmits(["deleteComment"]);
</script>

<template>
  <template v-for="comment of props.comments" :key="comment.id">
    <article class="message is-small" data-cy="Comment">
      <div class="message-header">
        <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
        <button
          @click="emit('deleteComment', comment.id)"
          type="button"
          class="delete is-small"
          aria-label="delete"
        >
          delete button
        </button>
      </div>
      <div class="message-body">{{ comment.body }}</div>
    </article>
  </template>
</template>
