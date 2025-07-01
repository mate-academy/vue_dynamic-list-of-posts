<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'
import { addNewComment } from '../api/comments'

const { postId } = defineProps(['postId'])

const emit = defineEmits(['closeCommentForm', 'addComment'])

const inputName = ref('')
const inputEmail = ref('')
const body = ref('')
const isLoading = ref(false)
const inputNameError = ref('')
const inputEmailError = ref('')
const bodyError = ref('')

const clearForm = () => {
  inputNameError.value = ''
  inputEmailError.value = ''
  bodyError.value = ''
  inputName.value = ''
  inputEmail.value = ''
  body.value = ''
}

const handleReset = () => {
  clearForm()
  emit('closeCommentForm')
}

const handleSubmit = () => {
  let error = false

  if (!inputName.value || !inputEmail.value || !body.value) {
    error = true
    if (!inputName.value) {
      inputNameError.value = 'Name is required'
    }
    if (!inputEmail.value) {
      inputEmailError.value = 'Email is required'
    }
    if (!body.value) {
      bodyError.value = 'Body is required'
    }
  }
  if (error) {
    error = false
    return
  }

  isLoading.value = true
  const newComment = {
    postId,
    name: inputName.value,
    email: inputEmail.value,
    body: body.value,
  }

  addNewComment(newComment)
    .then((res) => {
      emit('addComment', res.data)
      emit('closeCommentForm')
    })
    .catch((error) => {
      console.error('Failed to add comment:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
    })
    .finally(() => (isLoading.value = false))
}

watch(inputName, (val) => {
  if (val) inputNameError.value = ''
})

watch(inputEmail, (val) => {
  if (val) inputEmailError.value = ''
})

watch(body, (val) => {
  if (val) bodyError.value = ''
})

</script>

<template>
  <form @submit.prevent="handleSubmit">
    <InputField
      title="Author Name"
      v-model="inputName"
      :error="inputNameError"
      :inputName="'commentAuthor'"
      placeholder="Name Surname"
    />

    <InputField
      title="Author Email"
      v-model="inputEmail"
      :error="inputEmailError"
      :inputName="'commentEmail'"
      placeholder="Your Email"
      type="email"
    />

    <TextAreaField
      title="Write Post Body"
      v-model="body"
      :error="bodyError"
      :bodyName="'commentBody'"
      placeholder="Comment"
    />

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" :class="{'is-loading': isLoading}">Add comment</button>
      </div>
      <div class="control">
        <button type="button" @click="handleReset" class="button is-link is-light">Cancel</button>
      </div>
    </div>
  </form>
</template>
