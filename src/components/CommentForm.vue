<template>
  <div class="content">
    <h3>Add a Comment</h3>

    <form @submit.prevent="handleSubmit">
      <InputField
        name="name"
        label="Author Name"
        placeholder="Enter your name"
        v-model="formData.name"
        :error="errors.name"
        icon="fas fa-user"
      />

      <InputField
        name="email"
        label="Author Email"
        type="email"
        placeholder="Enter your email"
        v-model="formData.email"
        :error="errors.email"
        icon="fas fa-envelope"
      />

      <TextAreaField
        name="body"
        label="Comment"
        placeholder="Enter your comment"
        v-model="formData.body"
        :error="errors.body"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            :class="['button', 'is-link', { 'is-loading': loading }]"
          >
            Add Comment
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="handleClear"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

export default {
  name: 'CommentForm',
  components: {
    InputField,
    TextAreaField
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit'],
  data() {
    return {
      formData: {
        name: '',
        email: '',
        body: ''
      },
      errors: {
        name: '',
        email: '',
        body: ''
      }
    }
  },
  watch: {
    'formData.name'() {
      this.errors.name = ''
    },
    'formData.email'() {
      this.errors.email = ''
    },
    'formData.body'() {
      this.errors.body = ''
    }
  },
  methods: {
    handleSubmit() {
      this.errors = {
        name: '',
        email: '',
        body: ''
      }

      let hasError = false

      if (!this.formData.name.trim()) {
        this.errors.name = 'Name is required'
        hasError = true
      }

      if (!this.formData.email.trim()) {
        this.errors.email = 'Email is required'
        hasError = true
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = 'Invalid email format'
        hasError = true
      }

      if (!this.formData.body.trim()) {
        this.errors.body = 'Comment is required'
        hasError = true
      }

      if (!hasError) {
        this.$emit('submit', { ...this.formData })
        // Don't clear here - let parent clear after successful API call
      }
    },
    clearBody() {
      // Public method for parent to call after successful submission
      this.formData.body = ''
    },
    handleClear() {
      this.formData = {
        name: '',
        email: '',
        body: ''
      }
      this.errors = {
        name: '',
        email: '',
        body: ''
      }
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }
  }
}
</script>
