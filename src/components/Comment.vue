<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${email}`">{{ name }}</a>
      <button type="button" class="delete is-small" aria-label="delete" @click="deleteComment">
        Delete
      </button>
    </div>
    <div class="message-body">{{ body }}</div>
  </article>
</template>

<script>
export default {
  props: {
    name: String,
    email: String,
    body: String,
    commentId: Number
  },
  methods: {
    deleteComment() {
      this.$emit("delete", this.commentId);
    }
  }
};
</script>

<style scoped>
.message {
  margin-bottom: 10px;
}
</style>

