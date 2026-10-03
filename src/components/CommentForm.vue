<script>
import { createComment } from '../api/comments.js';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import Notification from './Notification.vue';

export default {
  name: 'CommentForm',
  components: {
    InputField,
    TextAreaField,
    Notification,
  },
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  emits: ['success', 'clear'],
  data() {
    return {
      name: '',
      email: '',
      body: '',
      errors: {
        name: '',
        email: '',
        body: '',
        message: '',
      },
      isSubmitting: false,
    };
  },
  watch: {
    name() {
      this.errors.name = '';
    },
    email() {
      this.errors.email = '';
    },
    body() {
      this.errors.body = '';
    },
  },
  methods: {
    validate() {
      this.errors.name = this.name.trim() ? '' : 'Name is required';
      this.errors.email = '';
      this.errors.body = this.body.trim() ? '' : 'Body is required';

      if (!this.email.trim()) {
        this.errors.email = 'Email is required';
      } else if (!this.isValidEmail(this.email.trim())) {
        this.errors.email = 'Please enter a valid email';
      }

      return !this.errors.name && !this.errors.email && !this.errors.body;
    },
    isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    async handleSubmit() {
      this.errors.message = '';

      if (!this.validate()) {
        return;
      }

      this.isSubmitting = true;

      try {
        const newComment = await createComment({
          postId: this.postId,
          name: this.name.trim(),
          email: this.email.trim(),
          body: this.body.trim(),
        });

        this.$emit('success', newComment);
        this.body = '';
      } catch {
        this.errors.message = 'Failed to add comment';
      } finally {
        this.isSubmitting = false;
      }
    },
    clearForm() {
      this.name = '';
      this.email = '';
      this.body = '';
      this.errors = {
        name: '',
        email: '',
        body: '',
        message: '',
      };
    },
  },
};
</script>

<template>
  <div class="content">
    <Notification
      v-if="errors.message"
      :message="errors.message"
      @close="errors.message = ''"
    />

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="name"
        name="name"
        label="Author name"
        placeholder="Name Surname"
        :error="errors.name"
      />
      <InputField
        v-model="email"
        name="email"
        type="email"
        label="Author email"
        placeholder="Your email"
        icon="envelope"
        :error="errors.email"
      />
      <TextAreaField
        v-model="body"
        name="Body"
        label="Write Comment"
        placeholder="Comment"
        :error="errors.body"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link" :class="{ 'is-loading': isSubmitting }" :disabled="isSubmitting">
            Add Comment
          </button>
        </div>
        <div class="control">
          <button type="button" class="button is-link is-light" :disabled="isSubmitting" @click="clearForm">
            Clear
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
