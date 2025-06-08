<script>
export default {
  name: 'CommentForm',
  emits: ['submit', 'update:modelValue', 'input'],
  data() {
    return {
      name: '',
      email: '',
      comment: '',
      hasErrorName: false,
      hasErrorComment: false,
    };
  },
  methods: {
    submitComment() {
      this.hasErrorName = !this.name.trim();
      this.hasErrorComment = !this.comment.trim();

      if (this.hasErrorName || this.hasErrorComment) {
        return;
      }

      const newComment = {
        name: this.name.trim(),
        email: this.email.trim(),
        body: this.comment.trim(),
      };

      this.$emit('submit', newComment);

      // Скидання полів
      this.name = '';
      this.email = '';
      this.comment = '';
      this.hasErrorName = false;
      this.hasErrorComment = false;
    },
    removeNameError() {
      this.hasErrorName = false;
    },
    removeCommentError() {
      this.hasErrorComment = false;
    },
  },
};
</script>

<template>
  <div>
    <input
      v-model="name"
      class="input"
      type="text"
      placeholder="Your name"
      :class="{ 'is-danger': hasErrorName }"
      @input="removeNameError"
    />
    <p v-if="hasErrorName" class="help is-danger">Name is required</p>

    <input
      v-model="email"
      class="input mt-2"
      type="email"
      placeholder="Your email (optional)"
    />

    <textarea
      v-model="comment"
      class="textarea mt-2"
      placeholder="Write your comment..."
      :class="{ 'is-danger': hasErrorComment }"
      @input="removeCommentError"
    ></textarea>
    <p v-if="hasErrorComment" class="help is-danger">Comment cannot be empty</p>

    <button class="button is-primary mt-3" @click="submitComment">Send</button>
  </div>
</template>

<style scoped>
.input,
.textarea {
  width: 100%;
}
</style>
