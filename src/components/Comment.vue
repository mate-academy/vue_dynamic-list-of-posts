<script>
export default {
  name: "Comment",
  emits: ["delateComment"],
  props: {
    comment: Object,
  },
};
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="$emit('delateComment', comment.id)"
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>

<style></style>
