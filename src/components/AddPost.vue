<script>
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

export default {
  name: 'AddPost',
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    selectedPost: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['closeForm', 'createPost', 'updatePost'],
  data() {
    return {
      fields: {
        title: '',
        body: '',
      },
      errors: {
        title: '',
        body: '',
      },
    }
  },
  watch: {
    selectedPost: {
      handler(newPost) {
        if (!newPost || !newPost.id) {
          this.fields.title = ''
          this.fields.body = ''
          return
        }

        this.fields.title = newPost.title
        this.fields.body = newPost.body
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleRemoveError(key) {
      this.errors[key] = ''
    },
    handleCheckErrors(key) {
      if (!this.fields[key]) {
        this.errors[key] = `${key} is required!`
      }
    },
    handleClose() {
      this.$emit('closeForm')
    },
    handleSubmit() {
      Object.keys(this.fields).forEach((key) => {
        this.handleCheckErrors(key)
      })

      if (Object.values(this.errors).some((error) => error.length > 0)) {
        return
      }

      if (Object.keys(this.selectedPost).includes('id')) {
        this.$emit('updatePost', { ...this.selectedPost, ...this.fields })
        return
      }

      this.$emit('createPost', { ...this.fields })
      this.fields.title = ''
      this.fields.body = ''
    },
  },
}
</script>

<template>
  <div className="content">
    <h2>{{ selectedPost.id !== undefined ? 'Editing Post' : 'Create new post' }}</h2>

    <form v-on:submit.prevent="handleSubmit" v-on:reset="handleClose">
      <InputField
        v-model="fields.title"
        :inputName="'postTitle'"
        :inputError="errors.title"
        @removeError="handleRemoveError('title')"
      />
      <TextAreaField
        v-model="fields.body"
        :textAreaName="'postBody'"
        :textAreaError="errors.body"
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
  </div>
</template>
