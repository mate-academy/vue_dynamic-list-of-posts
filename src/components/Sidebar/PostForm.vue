<script>
import InputField from '../FormComponents/InputField.vue'
import TextAreaField from '../FormComponents/TextAreaField.vue'
import { validateForm } from '@/utils/validateForm'

export default {
  name: 'PostForm',
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    posts: Object,
    selectedPost: Object,
    editingPost: Boolean,
  },
  emits: ['closeSidebar'],

  data() {
    return {
      post: {
        title: this.selectedPost ? this.selectedPost.title : '',
        body: this.selectedPost ? this.selectedPost.body : '',
      },
      errors: {
        title: '',
        body: '',
      },
    }
  },
  watch: {
    postTitle() {
      console.log(this.postTitle)
    },
    postBody() {
      console.log(this.postBody)
    },
  },
  methods: {
    clearForm() {
      this.post.title = ''
      this.post.body = ''
      this.$emit('closeSidebar')
    },

    addPost({ title, body }) {
      this.$store.dispatch('posts/addPost', { title, body })
    },

    editPost(newData) {
      this.$store.dispatch('posts/editPost', newData)
    },

    handleSubmit() {
      const { errors, hasErrors } = validateForm(this.post)
      console.log(errors)

      this.errors = errors
      if (hasErrors) {
        return
      }

      if (this.editingPost) {
        this.editPost({
          id: this.selectedPost.id,
          title: this.post.title,
          body: this.post.body,
        })
      } else {
        this.addPost({
          title: this.post.title,
          body: this.post.body,
        })
      }

      this.clearForm()
    },
  },
}
</script>

<template>
  <div class="content">
    <h2 v-if="!editingPost">Create new post</h2>
    <h2 v-else>Edit post</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        title="Title"
        placeholder="Post title"
        v-model="this.post.title"
        :errorMessage="this.errors.title"
        @delete-error="this.errors = {}"
      />
      <TextAreaField
        title="Post Body"
        placeholder="Write Post Body"
        v-model="this.post.body"
        :errorMessage="this.errors.body"
        @delete-error="this.errors = {}"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">
            {{ `${!editingPost ? 'Create' : 'Save'}` }}
          </button>
        </div>
        <div class="control">
          <button type="reset" @click="clearForm()" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>
