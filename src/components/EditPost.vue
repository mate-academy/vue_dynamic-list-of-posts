<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label
        class="label"
        for="edit-title"
      >
        Title
      </label>

      <div class="control">
        <input
          id="edit-title"
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
        for="edit-body"
      >
        Body
      </label>

      <div class="control">
        <textarea
          id="edit-body"
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
          Save
        </button>
      </div>

      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          :disabled="isSubmitting"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'EditPost',

  props: {
    post: {
      type: Object,
      required: true,
    },

    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['save', 'cancel'],

  data() {
    return {
      title: this.post.title,
      body: this.post.body,

      errors: {
        title: '',
        body: '',
      },
    };
  },

  watch: {
    post(newPost) {
      this.title = newPost.title;
      this.body = newPost.body;

      this.errors = {
        title: '',
        body: '',
      };
    },
  },

  methods: {
    clearError(field) {
      this.errors[field] = '';
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

      this.$emit('save', {
        ...this.post,
        title: this.title.trim(),
        body: this.body.trim(),
      });
    },
  },
};
</script>
