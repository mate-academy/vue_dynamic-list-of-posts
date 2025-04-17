<!-- filepath: c:\git-repos\course\vue\vue_dynamic-list-of-posts___\src\components\Comment.vue -->
<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${email}`">{{ name }}</a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="$emit('delete-comment', id)"
      >
        Delete
      </button>
    </div>
    <div class="message-body">{{ body }}</div>
  </article>
</template>

<script>
export default {
  name: 'UserComment',
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.message-header a {
  text-decoration: none;
  color: #3273dc;
}

.message-header a:hover {
  text-decoration: underline;
}

.delete {
  cursor: pointer;
}
</style>