<script lang="ts">
import { defineComponent, ref } from 'vue'
import { createComment } from '../../api/posts'

export default defineComponent({
  name: 'CommentForm',

  props: {
    postId: {
      type: Number,
      required: true,
    },
  },

  emits: ['comment-created', 'cancel'],

  setup(props, { emit }) {
    const isSubmitting = ref(false)
    const submitError = ref('')
    const newComment = ref({ name: '', email: '', body: '' })
    const errors = ref({ name: '', email: '', body: '' })

    function validate() {
      errors.value.name = newComment.value.name.trim() ? '' : 'Name is required'
      errors.value.email = newComment.value.email.trim() ? '' : 'Email is required'
      errors.value.body = newComment.value.body.trim() ? '' : 'Comment is required'
      return !errors.value.name && !errors.value.email && !errors.value.body
    }

    async function handleSubmit() {
      if (!validate()) return
      isSubmitting.value = true
      submitError.value = ''

      try {
        const created = await createComment({
          postId: props.postId,
          name: newComment.value.name.trim(),
          email: newComment.value.email.trim(),
          body: newComment.value.body.trim(),
        })
        emit('comment-created', created)
        newComment.value.body = ''
        errors.value.body = ''
      } catch {
        submitError.value = 'Failed to add comment. Please try again.'
      } finally {
        isSubmitting.value = false
      }
    }

    function handleClear() {
      newComment.value = { name: '', email: '', body: '' }
      errors.value = { name: '', email: '', body: '' }
      submitError.value = ''
    }

    return {
      isSubmitting,
      submitError,
      newComment,
      errors,
      handleSubmit,
      handleClear,
    }
  },
})
</script>

<template>
  <div class="box">
    <p class="title is-5">Write a comment</p>

    <div v-if="submitError" class="notification is-danger is-light">
      {{ submitError }}
    </div>

    <div class="field">
      <label class="label">Author Name</label>
      <div class="control">
        <input
          v-model="newComment.name"
          class="input"
          :class="{ 'is-danger': errors.name }"
          type="text"
          placeholder="Your name"
          @input="errors.name = ''"
        />
      </div>
      <p v-if="errors.name" class="help is-danger">{{ errors.name }}</p>
    </div>

    <div class="field">
      <label class="label">Author Email</label>
      <div class="control">
        <input
          v-model="newComment.email"
          class="input"
          :class="{ 'is-danger': errors.email }"
          type="email"
          placeholder="your@email.com"
          @input="errors.email = ''"
        />
      </div>
      <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>
    </div>

    <div class="field">
      <label class="label">Comment</label>
      <div class="control">
        <textarea
          v-model="newComment.body"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          placeholder="Write your comment..."
          @input="errors.body = ''"
        />
      </div>
      <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="button"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
          @click="handleSubmit"
        >
          Add
        </button>
      </div>
      <div class="control">
        <button type="button" class="button is-link is-light" @click="handleClear">Clear</button>
      </div>
    </div>
  </div>
</template>
