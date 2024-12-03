<script>
export default {
  name: "UserComment",
  props: {
    userComment: {
      type: Object,
      required: true,
    },
  },
  emits: ["deleteComment"],
};
</script>

<template>
  <article :class="'user-message is-small'">
    <div :class="'user-message-header'">
      <a :href="`mailto:${userComment.email}`">{{ userComment.name }}</a>
      <button
        type="button"
        :class="'remove-btn is-small'"
        aria-label="delete"
        @click="$emit('deleteComment', userComment.id)"
      ></button>
    </div>
    <div :class="'user-message-body'">{{ userComment.body }}</div>
  </article>
</template>
