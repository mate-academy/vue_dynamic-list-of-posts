<script setup>
import { ErrorMessages } from '@/utils/ErrorMessages.js'
import { ref } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'
import { postComment } from '@/api/comments'

const { postId } = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})
const comments = defineModel('comments', {
  type: Array,
})
const isLoading = defineModel('isLoading', {
  type: Boolean,
})
const commentsErrors = {
  nameError: ErrorMessages.None,
  emailError: ErrorMessages.None,
  bodyError: ErrorMessages.None,
}
const newCommentFormIsShown = defineModel('newCommentFormIsShown', {
  type: Boolean,
})
const errors = ref({
  ...commentsErrors,
})
const name = ref('')
const email = ref('')
const body = ref('')

const onClear = () => {
  newCommentFormIsShown.value = false
}

const onAddComment = async () => {
  isLoading.value = true
  errors.value = { ...commentsErrors }
  if (!name.value.trim()) {
    errors.value.nameError = ErrorMessages.Name_Is_Required
  }
  if (!email.value.trim()) {
    errors.value.emailError = ErrorMessages.Email_Is_Required
  }
  if (!body.value.trim()) {
    errors.value.bodyError = ErrorMessages.Comment_Is_Empty
  }

  if (errors.value.nameError || errors.value.emailError || errors.value.bodyError) {
    return
  }

  try {
    const newComment = await postComment(
      postId,
      name.value.trim(),
      email.value.trim(),
      body.value.trim(),
    )
    comments.value.push(newComment)
    newCommentFormIsShown.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form data-cy="NewCommentForm" @reset="onClear" @submit.prevent="onAddComment">
    <InputField
      v-model="name"
      v-model:error="errors.nameError"
      title="Author Name"
      placeholder="Author Name"
      icon="fa-user"
      :disabled="false"
      type="text"
    />
    <InputField
      v-model="email"
      v-model:error="errors.emailError"
      title="Author Email"
      icon="fa-envelope"
      placeholder="Author Email"
      type="email"
      :disabled="false"
    />
    <TextAreaField
      v-model="body"
      v-model:error="errors.bodyError"
      title="Comment"
      placeholder="Type comment"
    />
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" :class="{ 'is-loading': isLoading }">
          Add
        </button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light">Clear</button>
      </div>
    </div>
  </form>
</template>
