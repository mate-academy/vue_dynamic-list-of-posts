// CommentForm Component
const CommentForm = {
  name: 'CommentForm',
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  emits: ['commentAdded', 'cancel'],
  data() {
    return {
      form: {
        name: '',
        email: '',
        body: '',
      },
      errors: {
        name: '',
        email: '',
        body: '',
      },
      isSubmitting: false,
      submitError: '',
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {
        name: '',
        email: '',
        body: '',
      };

      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required';
        isValid = false;
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Email is not valid';
        isValid = false;
      }

      if (!this.form.body.trim()) {
        this.errors.body = 'Comment body is required';
        isValid = false;
      }

      return isValid;
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    clearError(field) {
      this.errors[field] = '';
      this.submitError = '';
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      this.submitError = '';

      try {
        const newComment = await api.createComment({
          postId: this.postId,
          name: this.form.name.trim(),
          email: this.form.email.trim(),
          body: this.form.body.trim(),
        });

        // Conservar nombre y email, limpiar solo el body
        this.form.body = '';
        this.errors = {
          name: '',
          email: '',
          body: '',
        };

        this.$emit('commentAdded', newComment);
      } catch (error) {
        this.submitError = 'Failed to add comment. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },
    handleReset() {
      this.form = {
        name: '',
        email: '',
        body: '',
      };
      this.errors = {
        name: '',
        email: '',
        body: '',
      };
      this.submitError = '';
    },
  },
  template: `
    <div class="content">
      <form @submit.prevent="handleSubmit">
        <InputField
          name="author-name"
          label="Author Name"
          placeholder="Enter your name"
          v-model="form.name"
          :error="errors.name"
          icon="fa-user"
          @update:modelValue="clearError('name')"
        />

        <InputField
          name="author-email"
          label="Author Email"
          placeholder="Enter your email"
          type="email"
          v-model="form.email"
          :error="errors.email"
          icon="fa-envelope"
          @update:modelValue="clearError('email')"
        />

        <TextAreaField
          name="comment-body"
          label="Comment"
          placeholder="Enter your comment"
          v-model="form.body"
          :error="errors.body"
          @update:modelValue="clearError('body')"
        />

        <div v-if="submitError" class="notification is-danger is-light">
          {{ submitError }}
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button 
              type="submit" 
              :class="['button', 'is-link', { 'is-loading': isSubmitting }]"
              :disabled="isSubmitting"
            >
              Add
            </button>
          </div>
          <div class="control">
            <button 
              type="button" 
              class="button is-link is-light"
              @click="handleReset"
              :disabled="isSubmitting"
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  `
};
