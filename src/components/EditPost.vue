<script>
import { updatePost } from '../api/posts.js';
import PostForm from './PostForm.vue';

export default {
  name: 'EditPost',
  components: {
    PostForm,
  },
  props: {
    post: {
      type: Object,
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
        const updatedPost = await updatePost({
          id: this.post.id,
          title,
          body,
        });

        this.$emit('success', updatedPost);
      } catch {
        this.errorMessage = 'Unable to save changes';
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<template>
  <PostForm
    title-text="Post editing"
    submit-text="Save"
    :initial-title="post.title"
    :initial-body="post.body"
    :error-message="errorMessage"
    :is-submitting="isSubmitting"
    @submit="handleSubmit"
    @cancel="$emit('cancel')"
    @close-error="errorMessage = ''"
  />
</template>
