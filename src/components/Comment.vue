<script>
export default {
  name: "Comment",
  props: {
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
    index: {
      type: Number,
      required: true,
    },
  },
  methods: {
    deleteComment() {
      this.$emit("delete-comment", this.index);
    },
  },
};
</script>

<template>
  <div class="block">
    <article class="message is-small" data-cy="Comment">
      <div class="message-header">
        <a href="mailto:vlasenkonadia@gmail.com" data-cy="CommentAuthor">{{
          name
        }}</a
        ><button
          data-cy="CommentDelete"
          type="button"
          class="delete is-small"
          aria-label="delete"
          @click="deleteComment"
        ></button>
      </div>
      <div class="message-body" data-cy="CommentBody">{{ body }}</div>
    </article>
  </div>
</template>
