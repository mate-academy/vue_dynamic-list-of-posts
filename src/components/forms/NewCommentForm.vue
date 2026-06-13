<template>
  <form @submit.prevent="handleSubmit">
    <div class="field" data-cy="NameField">
      <label class="label" :for="`comment-author-name-${postId}`"> Author Name </label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="name"
          :id="`comment-author-name-${postId}`"
          placeholder="Name Surname"
          class="input"
          :class="{ 'is-danger': errors.name }"
          v-model="name"
          @input="errors.name = ''"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span v-if="errors.name" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.name" class="help is-danger" data-cy="ErrorMessage">
        {{ errors.name }}
      </p>
    </div>

    <div class="field" data-cy="EmailField">
      <label class="label" :for="`comment-author-email-${postId}`"> Author Email </label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="email"
          :id="`comment-author-email-${postId}`"
          placeholder="email@app.com"
          class="input"
          :class="{ 'is-danger': errors.email }"
          v-model="email"
          @input="errors.email = ''"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span
          v-if="errors.email"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errors.email" class="help is-danger" data-cy="ErrorMessage">
        {{ errors.email }}
      </p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" :for="`comment-body-${postId}`"> Comment Text </label>
      <div class="control">
        <textarea
          :id="`comment-body-${postId}`"
          name="body"
          placeholder="Type comment here"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          v-model="body"
          @input="errors.body = ''"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">
        {{ errors.body }}
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" :class="{ 'is-loading': isSubmitting }">
          Add
        </button>
      </div>
      <div class="control">
        <button type="button" class="button is-link is-light" @click="handleClear">Clear</button>
      </div>
    </div>

    <p v-if="serverError" class="help is-danger">{{ serverError }}</p>
  </form>
</template>

<script>
import { createComment } from '../../api/comments'

export default {
  name: 'NewCommentForm',
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  emits: ['created'],
  data() {
    return {
      name: '',
      email: '',
      body: '',
      errors: {
        name: '',
        email: '',
        body: '',
      },
      serverError: '',
      isSubmitting: false,
    }
  },
  methods: {
    validate() {
      let isValid = true

      if (!this.name.trim()) {
        this.errors.name = 'Name is required'
        isValid = false
      }

      if (!this.email.trim()) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
        this.errors.email = 'Email is not valid'
        isValid = false
      }

      if (!this.body.trim()) {
        this.errors.body = 'Comment text is required'
        isValid = false
      }

      return isValid
    },

    async handleSubmit() {
      this.serverError = ''

      if (!this.validate()) {
        return
      }

      this.isSubmitting = true

      try {
        const comment = await createComment({
          postId: this.postId,
          name: this.name.trim(),
          email: this.email.trim(),
          body: this.body.trim(),
        })

        this.$emit('created', comment)
        this.body = ''
      } catch (error) {
        this.serverError = 'Failed to add comment. Please try again.'
      } finally {
        this.isSubmitting = false
      }
    },

    handleClear() {
      this.body = ''
      this.errors = {
        name: '',
        email: '',
        body: '',
      }
      this.serverError = ''
    },
  },
}
</script>
