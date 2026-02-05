<script lang="ts">
import '@fortawesome/fontawesome-free/css/all.min.css'
import { createPost } from '../api/posts';

export default {
  name: 'AddNewPost',

  props: {
    addNewPost: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      titlePost: '',
      bodyPost: '',
      titleError: '',
      bodyError: '',
      errorMessage: '',
    }
  },

  methods: {
    handleSubmit() {
      this.titleError = ''
      this.bodyError = ''
      this.errorMessage = ''

      if (!this.titlePost.trim()) {
        this.titleError = 'Title is required'
      }

      if (!this.bodyPost.trim()) {
        this.bodyError = 'Body is required'
      }

      if (this.titleError || this.bodyError) {
        return
      }

      const userId = localStorage.getItem('userId')
      if (!userId) return

      createPost(userId, this.titlePost, this.bodyPost)
        .then((response) => {
          this.titlePost = ''
          this.bodyPost = ''
          this.$emit('close')
          this.$emit('post-created', response.data.id)
        })
        .catch((error) => {
          this.errorMessage = error.message
        })
    },
    handleCancel() {
      this.titleError = '';
      this.bodyError = '';
      this.titlePost = '';
      this.bodyPost = '';
      this.$emit('close')
    }
  }
}
</script>

<template>
  <div class="add-new-post">
    <h1 class="add-new-post__title">Create new post</h1>

    <form action="submit">
      <div class="add-new-post__form">
        <div class="field">
          <label class="label">Title</label>
          <div class="control has-icons-left has-icons-right custom-input" :class="{ 'is-danger': titleError }">

            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>

            <!-- права іконка -->
            <span v-if="titleError" class="icon is-small is-right">
              <i class="fas fa-exclamation-triangle"></i>
            </span>

            <input class="input" type="text" placeholder="Post Title" v-model="titlePost" @input="titleError = ''" />
          </div>

          <span v-if="titleError" class="help is-danger">{{ titleError }}</span>

        </div>

        <div class="field">
          <label class="label">Write Post Body</label>
          <div class="control has-icons-left has-icons-right custom-input" :class="{ 'is-danger': bodyError }">

            <!-- права іконка -->
            <span v-if="bodyError" class="icon is-small is-right">
              <i class="fas fa-exclamation-triangle"></i>
            </span>

            <textarea class="textarea" placeholder="Post Body" v-model="bodyPost" @input="bodyError = ''"></textarea>
          </div>

          <span v-if="bodyError" class="help is-danger">{{ bodyError }}</span>
        </div>
      </div>

      <button @click.prevent="handleSubmit()">Create</button>
      <button @click.prevent="handleCancel()">Cancel</button>
    </form>
  </div>
</template>
