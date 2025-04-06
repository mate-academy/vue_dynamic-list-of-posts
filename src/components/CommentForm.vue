<script>
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

export default {
  name: 'CommentForm',
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    error: String,
  },
  emits: ['createComment', 'closeForm'],
  data() {
    return {
      fields: {
        name: '',
        email: '',
        body: '',
      },
      errors: {
        name: '',
        email: '',
        body: '',
      },
    }
  },
  methods: {
    handleRemoveError(key) {
      this.errors[key] = ''
    },
    handleCheckErrors() {
      if (!this.fields.name) {
        this.errors.name = `Name is required!`
      }
      if (!this.fields.email) {
        this.errors.email = `Email is required!`
      }
      if (!this.fields.body) {
        this.errors.body = `Comment is required!`
      }

      const emailPattern = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/
      if (!this.errors.email && !emailPattern.test(this.fields.email)) {
        this.errors.email = `Email is no valid!`
      }
    },
    handleSubmit() {
      this.handleCheckErrors()

      if (Object.values(this.errors).some((error) => error.length > 0)) {
        return
      }

      this.$emit('createComment', { ...this.fields })
    },
    handleReset() {
      this.$emit('closeForm')
    },
  },
}
</script>

<template>
  <form @submit.prevent="handleSubmit" @reset="handleReset" novalidate>
    <InputField
      v-model="fields.name"
      :input-name="'commentAuthor'"
      :input-error="errors.name"
      @removeError="handleRemoveError('name')"
    />
    <InputField
      v-model="fields.email"
      :input-name="'commentAuthorEmail'"
      :input-error="errors.email"
      @removeError="handleRemoveError('email')"
    />
    <TextAreaField
      v-model="fields.body"
      :text-area-name="'commentBody'"
      :text-area-error="errors.body"
      @removeError="handleRemoveError('body')"
    />

    <div className="field is-grouped">
      <div className="control">
        <button type="submit" className="button is-link">Save</button>
      </div>
      <div className="control">
        <button type="reset" className="button is-link is-light">Cancel</button>
      </div>
    </div>
  </form>

  <div class="block error-message" v-if="error">
    <p class="title is-6">{{ error }}</p>
  </div>
</template>
