<script setup>
import { ErrorMessages } from '@/utils/ErrorMessages'
import { ref } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'
import { addComments } from '@/api/api.comments'
const { postId } = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})
const comments = defineModel('comments', {
  type: Array,
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
    const newComment = addComments(
      postId,
      name.value.trim(),
      email.value.trim(),
      body.value.trim(),
    )
    comments.value.push(newComment);
    newCommentFormIsShown.value = false
  } catch (error) {
    console.error(error)
  }
};
</script>

<template>
  <form data-cy="NewCommentForm" @reset="onClear" @submit.prevent="onAddComment">
    <InputField
      v-model="name"
      v-model:error="errors.nameError"
      title="Author Name"
      placeholder="Author Name"
      icon="fa-user"
      :disabled="userNoRegistered"
      type="text"
    />
    <InputField
      v-model="email"
      v-model:error="errors.emailError"
      title="Author Email"
      icon="fa-envelope"
      placeholder="Author Email"
      type="email"
      :disabled="userNoRegistered"
    />
    <TextAreaField
      v-model="body"
      v-model:error="errors.bodyError"
      title="Comment"
      placeholder="Type comment"
    />
    <div className="field is-grouped">
      <div className="control">
        <button type="submit" class="button is-link" :class="{ 'is-loading': isLoading }">
          Add
        </button>
      </div>
      <div className="control">
        <button type="reset" className="button is-link is-light">Clear</button>
      </div>
    </div>
  </form>
</template>
