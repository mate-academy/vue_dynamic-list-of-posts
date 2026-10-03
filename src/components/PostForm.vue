<script>
import InputField from './InputField.vue';
import Notification from './Notification.vue';
import TextAreaField from './TextAreaField.vue';

export default {
  name: 'PostForm',
  components: {
    InputField,
    Notification,
    TextAreaField,
  },
  props: {
    titleText: {
      type: String,
      required: true,
    },
    submitText: {
      type: String,
      required: true,
    },
    initialTitle: {
      type: String,
      default: '',
    },
    initialBody: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'cancel', 'close-error'],
  data() {
    return {
      title: this.initialTitle,
      body: this.initialBody,
      errors: {
        title: '',
        body: '',
      },
      showValidation: false,
    };
  },
  watch: {
    initialTitle(value) {
      this.title = value;
    },
    initialBody(value) {
      this.body = value;
    },
    title(value) {
      if (this.showValidation && value.trim()) {
        this.errors.title = '';
      }
    },
    body(value) {
      if (this.showValidation && value.trim()) {
        this.errors.body = '';
      }
    },
  },
  methods: {
    validate() {
      this.showValidation = true;
      this.errors.title = this.title.trim() ? '' : 'Title is required';
      this.errors.body = this.body.trim() ? '' : 'Body is required';

      return !this.errors.title && !this.errors.body;
    },
    handleSubmit() {
      if (!this.validate()) {
        return;
      }

      this.$emit('submit', {
        title: this.title.trim(),
        body: this.body.trim(),
      });
    },
  },
};
</script>

<template>
  <div class="content">
    <h2>{{ titleText }}</h2>

    <Notification
      v-if="errorMessage"
      :message="errorMessage"
      @close="$emit('close-error')"
    />

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="title"
        name="Title"
        label="Title"
        placeholder="Post title"
        :error="errors.title"
      />
      <TextAreaField
        v-model="body"
        name="Body"
        label="Write Post Body"
        placeholder="Post body"
        :error="errors.body"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link" :class="{ 'is-loading': isSubmitting }" :disabled="isSubmitting">
            {{ submitText }}
          </button>
        </div>
        <div class="control">
          <button type="button" class="button is-link is-light" :disabled="isSubmitting" @click="$emit('cancel')">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
