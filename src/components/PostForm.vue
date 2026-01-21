<template>
  <div class="content">
    <h2>{{ isEdit ? 'Edit Post' : 'Create New Post' }}</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        name="title"
        label="Title"
        placeholder="Enter post title"
        v-model="formData.title"
        :error="errors.title"
        icon="fas fa-heading"
      />

      <TextAreaField
        name="body"
        label="Body"
        placeholder="Enter post body"
        v-model="formData.body"
        :error="errors.body"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            :class="['button', 'is-link', { 'is-loading': loading }]"
          >
            {{ isEdit ? 'Save' : 'Create' }}
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="$emit('cancel')"
          >
            Cancel
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
  name: 'PostForm',
  components: {
    InputField,
    TextAreaField
  },
  props: {
    post: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  data() {
    return {
      formData: {
        title: this.post?.title || '',
        body: this.post?.body || ''
      },
      errors: {
        title: '',
        body: ''
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.post
    }
  },
  watch: {
    'formData.title'() {
      this.errors.title = ''
    },
    'formData.body'() {
      this.errors.body = ''
    },
    post(newPost) {
      if (newPost) {
        this.formData.title = newPost.title
        this.formData.body = newPost.body
      }
    }
  },
  methods: {
    handleSubmit() {
      this.errors = {
        title: '',
        body: ''
      }

      let hasError = false

      if (!this.formData.title.trim()) {
        this.errors.title = 'Title is required'
        hasError = true
      }

      if (!this.formData.body.trim()) {
        this.errors.body = 'Body is required'
        hasError = true
      }

      if (!hasError) {
        this.$emit('submit', { ...this.formData })
      }
    }
  }
}
</script>
