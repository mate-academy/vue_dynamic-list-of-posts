<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input class="input" v-model="title" :class="{ 'is-danger': submitted && errors.title }" @input="clearError('title')" required />
      </div>
      <p v-if="submitted && errors.title" class="help is-danger">{{ errors.title }}</p>
    </div>

    <div class="field">
      <label class="label">Body</label>
      <div class="control">
        <textarea class="textarea" v-model="body" :class="{ 'is-danger': submitted && errors.body }" @input="clearError('body')" required></textarea>
      </div>
      <p v-if="submitted && errors.body" class="help is-danger">{{ errors.body }}</p>
    </div>

    <Notification v-if="errors.general" type="is-danger" :message="errors.general" class="mt-2" />

    <div class="buttons">
      <button class="button is-primary" type="submit" :disabled="isSubmitting" :class="{ 'is-loading': isSubmitting }">
        {{ post ? 'Save' : 'Create' }}
      </button>
      <button class="button" type="button" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

<script>
import Notification from './Notification.vue';

export default {
  components: { Notification },
  props: { post: Object },
  data() {
    return {
      title: this.post?.title || '',
      body: this.post?.body || '',
      errors: {},
      submitted: false,
      isSubmitting: false
    };
  },
  methods: {
    clearError(field) { this.errors[field] = null; },
    async handleSubmit() {
      this.submitted = true;
      this.errors = {};

      if (!this.title) this.errors.title = 'Title is required';
      if (!this.body) this.errors.body = 'Body is required';
      if (Object.keys(this.errors).length) return;

      this.isSubmitting = true;

      try {
        const url = this.post
          ? `https://mate-academy.github.io/fe-students-api/posts/${this.post.id}`
          : 'https://mate-academy.github.io/fe-students-api/posts';
        const method = this.post ? 'PATCH' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: this.title, body: this.body, userId: 1 })
        });

        if (!res.ok) throw new Error('Failed to save post');

        const result = await res.json();
        this.$emit(this.post ? 'updated' : 'created', result);
      } catch (err) {
        this.errors.general = err.message || 'Failed to save post';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>
