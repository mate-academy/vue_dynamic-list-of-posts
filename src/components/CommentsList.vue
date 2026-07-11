<script setup>
defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["delete-comment"]);
</script>

<template>
  <div v-for="comment of comments" :key="comment.id">
    <article class="message is-small">
      <div class="message-header">
        <a href="mailto:2342@gmail.com" data-cy="CommentAuthor">{{
          comment.name
        }}</a
        ><button
          data-cy="CommentDelete"
          type="button"
          class="delete is-small"
          aria-label="delete"
          @click="$emit('delete-comment', comment.id)"
        ></button>
      </div>
      <div class="message-body" data-cy="CommentBody">
        {{ comment.body }}
      </div>
    </article>
  </div>
</template>