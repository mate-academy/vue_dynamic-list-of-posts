<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label
        class="label"
        for="comment-name"
      >
        Name
      </label>

      <div class="control">
        <input
          id="comment-name"
          v-model="name"
          type="text"
          class="input"
          :class="{ 'is-danger': errors.name }"
          @input="clearError('name')"
        />
      </div>

      <p
        v-if="errors.name"
        class="help is-danger"
      >
        {{ errors.name }}
      </p>
    </div>

    <div class="field">
      <label
        class="label"
        for="comment-email"
      >
        Email
      </label>

      <div class="control">
        <input
          id="comment-email"
          v-model="email"
          type="email"
          class="input"
          :class="{ 'is-danger': errors.email }"
          @input="clearError('email')"
        />
      </div>

      <p
        v-if="errors.email"
        class="help is-danger"
      >
        {{ errors.email }}
      </p>
    </div>

    <div class="field">
      <label
        class="label"
        for="comment-body"
      >
        Comment
      </label>

      <div class="control">
        <textarea
          id="comment-body"
          v-model="body"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          @input="clearError('body')"
        ></textarea>
      </div>

      <p
        v-if="errors.body"
        class="help is-danger"
      >
        {{ errors.body }}
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
          :disabled="isSubmitting"
        >
          Add
        </button>
      </div>

      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          :disabled="isSubmitting"
          @click="clearForm"
        >
          Clear
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'WriteComment',

  props: {
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['submit'],

  data() {
    return {
      name: '',
      email: '',
      body: '',

      errors: {
        name: '',
        email: '',
        body: '',
      },
    };
  },

  methods: {
    clearError(field) {
      this.errors[field] = '';
    },

    clearForm() {
      this.errors = {
        name: '',
        email: '',
        body: '',
      };
    },

    handleSubmit() {
      this.errors = {
        name: '',
        email: '',
        body: '',
      };

      if (!this.name.trim()) {
        this.errors.name = 'Name is required';
      }

      if (!this.email.trim()) {
        this.errors.email = 'Email is required';
      } else if (!this.isValidEmail(this.email)) {
        this.errors.email = 'Email is invalid';
      }

      if (!this.body.trim()) {
        this.errors.body = 'Comment is required';
      }

      if (
        this.errors.name ||
        this.errors.email ||
        this.errors.body
      ) {
        return;
      }

      this.$emit('submit', {
        name: this.name.trim(),
        email: this.email.trim(),
        body: this.body.trim(),
      });
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    clearComment() {
      this.body = '';
    },
  },
};
</script>
