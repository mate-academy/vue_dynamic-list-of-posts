// PostForm Component
const PostForm = {
  name: 'PostForm',
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    post: {
      type: Object,
      default: null,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      form: {
        title: this.post?.title || '',
        body: this.post?.body || '',
      },
      errors: {
        title: '',
        body: '',
      },
      isSubmitting: false,
    };
  },
  watch: {
    post: {
      handler(newPost) {
        if (newPost) {
          this.form.title = newPost.title;
          this.form.body = newPost.body;
        } else {
          this.form.title = '';
          this.form.body = '';
        }
        this.errors = {
          title: '',
          body: '',
        };
      },
      deep: true,
    },
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {
        title: '',
        body: '',
      };

      if (!this.form.title.trim()) {
        this.errors.title = 'Title is required';
        isValid = false;
      }

      if (!this.form.body.trim()) {
        this.errors.body = 'Body is required';
        isValid = false;
      }

      return isValid;
    },
    clearError(field) {
      this.errors[field] = '';
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      try {
        const postData = {
          title: this.form.title.trim(),
          body: this.form.body.trim(),
        };

        this.$emit('save', postData);
      } finally {
        this.isSubmitting = false;
      }
    },
    handleCancel() {
      this.form = {
        title: this.post?.title || '',
        body: this.post?.body || '',
      };
      this.errors = {
        title: '',
        body: '',
      };
      this.$emit('cancel');
    },
  },
  template: `
    <div class="content">
      <h2>{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h2>

      <form @submit.prevent="handleSubmit">
        <InputField
          name="post-title"
          label="Title"
          placeholder="Enter post title"
          v-model="form.title"
          :error="errors.title"
          icon="fa-heading"
          @update:modelValue="clearError('title')"
        />

        <TextAreaField
          name="post-body"
          label="Body"
          placeholder="Enter post content"
          v-model="form.body"
          :error="errors.body"
          @update:modelValue="clearError('body')"
        />

        <div class="field is-grouped">
          <div class="control">
            <button 
              type="submit" 
              :class="['button', 'is-link', { 'is-loading': isSubmitting }]"
              :disabled="isSubmitting"
            >
              {{ isEditing ? 'Save' : 'Create' }}
            </button>
          </div>
          <div class="control">
            <button 
              type="button" 
              class="button is-link is-light"
              @click="handleCancel"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  `
};
