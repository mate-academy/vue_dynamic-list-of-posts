<script setup>
import { reactive, ref } from 'vue'

import { createComment } from '@/api/posts'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const props = defineProps({
  postId: {
    type: [Number, String],
    required: true,
  },
})

const emit = defineEmits(['cancel', 'created'])

const commentForm = reactive({
  name: '',
  email: '',
  body: '',
})

const commentFormErrors = reactive({
  name: '',
  email: '',
  body: '',
})

const isSubmitting = ref(false)
const submitError = ref('')

const validateCommentForm = () => {
  commentFormErrors.name = commentForm.name.trim() ? '' : 'Author name is required'

  commentFormErrors.email = commentForm.email.trim() ? '' : 'Author email is required'

  commentFormErrors.body = commentForm.body.trim() ? '' : 'Comment text is required'

  return !commentFormErrors.name && !commentFormErrors.email && !commentFormErrors.body
}

const clearFieldError = (fieldName) => {
  commentFormErrors[fieldName] = ''
  submitError.value = ''
}

const handleClear = () => {
  commentFormErrors.name = ''
  commentFormErrors.email = ''
  commentFormErrors.body = ''
  submitError.value = ''
}

const handleSubmit = async () => {
  submitError.value = ''

  if (!validateCommentForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const createdComment = await createComment({
      postId: props.postId,
      name: commentForm.name.trim(),
      email: commentForm.email.trim(),
      body: commentForm.body.trim(),
    })

    emit('created', createdComment)
    commentForm.body = ''
  } catch {
    submitError.value = 'Failed to create comment'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <InputField
      :id="`comment-author-name-${postId}`"
      v-model="commentForm.name"
      label="Author Name"
      name="name"
      placeholder="Name Surname"
      data-cy="NameField"
      :error="commentFormErrors.name"
      @update:model-value="clearFieldError('name')"
    />

    <InputField
      :id="`comment-author-email-${postId}`"
      v-model="commentForm.email"
      label="Author Email"
      name="email"
      type="email"
      icon="fas fa-envelope"
      placeholder="Your Email"
      data-cy="EmailField"
      :error="commentFormErrors.email"
      @update:model-value="clearFieldError('email')"
    />

    <TextAreaField
      :id="`comment-body-${postId}`"
      v-model="commentForm.body"
      label="Write Post Body"
      name="body"
      placeholder="Comment"
      data-cy="BodyField"
      :error="commentFormErrors.body"
      @update:model-value="clearFieldError('body')"
    />

    <div v-if="submitError" class="notification is-danger is-light">
      {{ submitError }}

      <button
        type="button"
        class="button is-danger is-light is-small ml-3"
        :class="{ 'is-loading': isSubmitting }"
        @click="handleSubmit"
      >
        Retry
      </button>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" :class="{ 'is-loading': isSubmitting }">
          Add Comment
        </button>
      </div>

      <div class="control">
        <button type="button" class="button is-link is-light" @click="handleClear">Clear</button>
      </div>

      <div class="control">
        <button type="button" class="button is-link is-light" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </form>
</template>
