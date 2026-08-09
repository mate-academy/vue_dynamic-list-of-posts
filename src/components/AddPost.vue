<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label
        class="label"
        for="post-title"
      >
        Title
      </label>

      <div class="control">
        <input
          id="post-title"
          v-model="title"
          type="text"
          class="input"
          :class="{ 'is-danger': errors.title }"
          @input="clearError('title')"
        />
      </div>

      <p
        v-if="errors.title"
        class="help is-danger"
      >
        {{ errors.title }}
      </p>
    </div>

    <div class="field">
      <label
        class="label"
        for="post-body"
      >
        Body
      </label>

      <div class="control">
        <textarea
          id="post-body"
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
          Create
        </button>
      </div>

      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          :disabled="isSubmitting"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'AddPost',

  props: {
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['create', 'cancel'],

  data() {
    return {
      title: '',
      body: '',

      errors: {
        title: '',
        body: '',
      },
    };
  },

  methods: {
    clearError(field) {
      this.errors[field] = '';
    },

    clearForm() {
      this.title = '';
      this.body = '';

      this.errors = {
        title: '',
        body: '',
      };
    },

    handleSubmit() {
      this.errors = {
        title: '',
        body: '',
      };

      if (!this.title.trim()) {
        this.errors.title = 'Title is required';
      }

      if (!this.body.trim()) {
        this.errors.body = 'Body is required';
      }

      if (this.errors.title || this.errors.body) {
        return;
      }

      this.$emit('create', {
        title: this.title.trim(),
        body: this.body.trim(),
      });

      this.clearForm();
    },

    handleCancel() {
      this.clearForm();
      this.$emit('cancel');
    },
  },
};
</script>
