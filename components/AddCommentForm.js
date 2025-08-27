// AddCommentForm.js - Окремий компонент для форми коментарів
const AddCommentForm = {
  name: 'AddCommentForm',
  props: {
    initialName: {
      type: String,
      default: ''
    },
    initialEmail: {
      type: String,
      default: ''
    },
    postId: {
      type: Number,
      required: true
    }
  },
  emits: ['comment-added', 'comment-error'],
  data() {
    return {
      form: {
        name: this.initialName,
        email: this.initialEmail,
        body: ''
      },
      errors: {},
      isSubmitting: false,
      submitError: null
    };
  },
  methods: {
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      this.submitError = null;

      try {
        const response = await fetch('https://mate.academy/students-api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({
            name: this.form.name,
            email: this.form.email,
            body: this.form.body,
            postId: this.postId
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newComment = await response.json();
        
        // Emit success event
        this.$emit('comment-added', newComment);
        
        // Clear only comment body, keep name and email
        this.form.body = '';
        this.errors = {};
        
      } catch (error) {
        console.error('Error adding comment:', error);
        this.submitError = 'Failed to add comment. Please try again.';
        this.$emit('comment-error', error);
      } finally {
        this.isSubmitting = false;
      }
    },

    validateForm() {
      this.errors = {};
      
      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required';
      }
      
      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required';
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }
      
      if (!this.form.body.trim()) {
        this.errors.body = 'Comment is required';
      }
      
      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
      if (this.submitError) {
        this.submitError = null;
      }
    },

    clearForm() {
      this.form = {
        name: this.initialName,
        email: this.initialEmail,
        body: ''
      };
      this.errors = {};
      this.submitError = null;
    },

    retrySubmit() {
      this.submitError = null;
      this.submitForm();
    }
  },
  template: `
    <div class="mt-4">
      <h4>Add Comment</h4>
      
      <!-- Submit Error -->
      <div v-if="submitError" class="notification is-danger">
        <div class="is-flex is-justify-content-space-between is-align-items-center">
          <span>{{ submitError }}</span>
          <button 
            type="button" 
            class="button is-small is-danger is-light"
            @click="retrySubmit"
          >
            Retry
          </button>
        </div>
      </div>

      <form @submit.prevent="submitForm">
        <div class="field" data-cy="NameField">
          <label class="label" :for="\`comment-author-name-\${form.name}\`">
            Name
          </label>
          <div class="control has-icons-left has-icons-right">
            <input
              type="text"
              name="name"
              :id="\`comment-author-name-\${form.name}\`"
              placeholder="Enter your name"
              v-model="form.name"
              class="input"
              :class="{ 'is-danger': errors.name }"
              @input="clearError('name')"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>

            <span
              v-if="errors.name"
              class="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i class="fas fa-exclamation-triangle"></i>
            </span>
          </div>

          <p v-if="errors.name" class="help is-danger" data-cy="ErrorMessage">
            {{ errors.name }}
          </p>
        </div>

        <div class="field">
          <label class="label" for="comment-email">Email</label>
          <div class="control has-icons-left has-icons-right">
            <input
              type="email"
              id="comment-email"
              placeholder="Enter your email"
              v-model="form.email"
              class="input"
              :class="{ 'is-danger': errors.email }"
              @input="clearError('email')"
              required
            />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>

            <span
              v-if="errors.email"
              class="icon is-small is-right has-text-danger"
            >
              <i class="fas fa-exclamation-triangle"></i>
            </span>
          </div>

          <p v-if="errors.email" class="help is-danger">
            {{ errors.email }}
          </p>
        </div>

        <div class="field" data-cy="BodyField">
          <label class="label" for="comment-body">Comment</label>
          <div class="control">
            <textarea
              id="comment-body"
              name="body"
              placeholder="Enter your comment"
              v-model="form.body"
              class="textarea"
              :class="{ 'is-danger': errors.body }"
              @input="clearError('body')"
              required
            ></textarea>
          </div>

          <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">
            {{ errors.body }}
          </p>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button 
              type="submit" 
              class="button is-link"
              :class="{ 'is-loading': isSubmitting }"
            >
              Add Comment
            </button>
          </div>
          <div class="control">
            <button 
              type="button" 
              class="button is-link is-light"
              @click="clearForm"
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  `
};

export default AddCommentForm;
