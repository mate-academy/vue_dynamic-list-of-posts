<script>
import { createPost } from '../api/posts.js';
import PostForm from './PostForm.vue';

export default {
  name: 'AddPost',
  components: {
    PostForm,
  },
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  emits: ['cancel', 'success'],
  data() {
    return {
      errorMessage: '',
      isSubmitting: false,
    };
  },
  methods: {
    async handleSubmit({ title, body }) {
      this.errorMessage = '';
      this.isSubmitting = true;

      try {
        const newPost = await createPost({
          title,
          body,
          userId: this.userId,
        });

        this.$emit('success', newPost);
      } catch {
        this.errorMessage = 'Failed to create post';
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<template>
  <PostForm
    title-text="Create new post"
    submit-text="Create"
    :error-message="errorMessage"
    :is-submitting="isSubmitting"
    @submit="handleSubmit"
    @cancel="$emit('cancel')"
    @close-error="errorMessage = ''"
  />
</template>
