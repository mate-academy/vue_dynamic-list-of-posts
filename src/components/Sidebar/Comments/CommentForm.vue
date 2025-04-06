<script>
import InputField from '@/components/FormComponents/InputField.vue'
import TextAreaField from '@/components/FormComponents/TextAreaField.vue'
import { validateForm } from '@/utils/validateForm'

export default {
  name: 'CommentForm',
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    title: String,
    formType: String,
    selectedPost: Object,
  },

  emits: ['closeForm'],
  data() {
    return {
      comment: {
        name: '',
        email: '',
        comment: '',
      },

      error: {},
    }
  },
  watch: {
    comment: {
      deep: true,
      handler() {
        console.log(this.comment)

        this.error = {}
      },
    },
  },

  methods: {
    clearForm() {
      Object.assign(this.comment, { comment: '' })
    },

    handleSubmit() {
      const { errors, hasErrors } = validateForm(this.comment)
      console.log(errors)

      if (hasErrors) {
        this.error = errors
        return
      }

      const payload = {
        name: this.comment.name,
        email: this.comment.email,
        body: this.comment.comment,
        postId: this.selectedPost.id,
      }

      console.log(payload)

      this.$store.dispatch('comments/addComment', payload)
      this.clearForm()
    },

    handleReset() {
      this.clearForm()
      this.$emit('closeForm')
    },
  },
}
</script>

<template>
  <div class="content">
    <form @submit.prevent="handleSubmit">
      <InputField
        title="Author Name"
        v-model:modelValue="comment.name"
        placeholder="Your full name."
        :errorMessage="error.name"
        @delete-error="this.errors = {}"
      />
      <InputField
        title="Author Email"
        v-model:modelValue="comment.email"
        placeholder="Your full email."
        type="email"
        :errorMessage="error.email"
        @delete-error="this.errors = {}"
      />
      <TextAreaField
        title="Your comment"
        v-model:modelValue="comment.comment"
        placeholder="Your comment."
        :errorMessage="error.comment"
        @delete-error="this.errors = {}"
      />
      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>
        <div class="control">
          <button type="reset" @click="handleReset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>
