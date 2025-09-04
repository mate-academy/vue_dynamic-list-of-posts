<template>
  <form @submit.prevent="submitComment">
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input"
          v-model="name"
          :class="{ 'is-danger': submitted && errors.name }"
          @input="clearError('name')"
          required
        />
      </div>
      <p v-if="submitted && errors.name" class="help is-danger">{{ errors.name }}</p>
    </div>

    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input
          type="email"
          class="input"
          v-model="email"
          :class="{ 'is-danger': submitted && errors.email }"
          @input="clearError('email')"
          required
        />
      </div>
      <p v-if="submitted && errors.email" class="help is-danger">{{ errors.email }}</p>
    </div>

    <div class="field">
      <label class="label">Comment</label>
      <div class="control">
        <textarea
          class="textarea"
          v-model="body"
          :class="{ 'is-danger': submitted && errors.body }"
          @input="clearError('body')"
          required
        ></textarea>
      </div>
      <p v-if="submitted && errors.body" class="help is-danger">{{ errors.body }}</p>
    </div>

    <Notification v-if="errors.general" type="is-danger" :message="errors.general" class="mt-2" />

    <div class="buttons">
      <button class="button is-primary" :disabled="isSubmitting" :class="{ 'is-loading': isSubmitting }" type="submit">
        Submit
      </button>
      <button class="button" type="button" @click="clearForm">Clear</button>
    </div>
  </form>
</template>

<script>
import Notification from './Notification.vue';

export default {
  components: { Notification },
  props: {
    postId: { type: Number, required: true }
  },
  data() {
    return {
      name: '',
      email: '',
      body: '',
      errors: {},
      submitted: false,
      isSubmitting: false
    };
  },
  methods: {
    clearError(field) {
      this.errors[field] = null;
    },
    clearForm() {
      this.name = '';
      this.email = '';
      this.body = '';
      this.errors = {};
      this.submitted = false;
    },
    async submitComment() {
      this.submitted = true;
      this.errors = {};

      if (!this.name) this.errors.name = 'Name is required';
      if (!this.email) this.errors.email = 'Email is required';
      if (!this.body) this.errors.body = 'Comment is required';

      if (Object.keys(this.errors).length) return;

      this.isSubmitting = true;

      try {
        const res = await fetch('https://mate-academy.github.io/fe-students-api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            body: this.body,
            postId: this.postId
          }),
        });

        if (!res.ok) throw new Error('Failed to submit comment');

        const newComment = await res.json();
        this.$emit('added', newComment);
        this.body = '';
        this.errors.general = null;
      } catch (err) {
        this.errors.general = err.message || 'Failed to submit comment';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>
