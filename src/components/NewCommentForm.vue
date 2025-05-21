<script setup>
import { ref } from 'vue'
import { ErrorMessages } from '@/utils/ErrorMessages'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const name = ref('')
const email = ref('')
const body = ref('')

const nameError = ref('')
const emailError = ref('')
const bodyError = ref('')

const emit = defineEmits(['submit', 'cancel'])

const handleSubmit = () => {
  const nameTrimmed = name.value.trim()
  const emailTrimmed = email.value.trim()
  const bodyTrimmed = body.value.trim()

  nameError.value = ''
  emailError.value = ''
  bodyError.value = ''

  if (!nameTrimmed) {
    nameError.value = ErrorMessages.Name_Is_Required
  }
  if (!emailTrimmed) {
    emailError.value = ErrorMessages.Email_Is_Empty
  }
  if (!bodyTrimmed) {
    bodyError.value = ErrorMessages.Comment_Is_Empty
  }

  if (nameError.value || emailError.value || bodyError.value) {
    return
  }

  emit('submit', nameTrimmed, emailTrimmed, bodyTrimmed)
}
</script>

<template>
  <div class="content">
    <form @submit.prevent="handleSubmit">
      <InputField
        :modelValue="name"
        v-model:error="nameError"
        title="Author Name"
        name="name"
        placeholder="Name Surname"
        icon="fa-user"
        @update:modelValue="(val) => (name = val)"
      />

      <InputField
        :modelValue="email"
        v-model:error="emailError"
        title="Author Email"
        name="email"
        type="email"
        placeholder="Your Email"
        icon="fa-envelope"
        @update:modelValue="(val) => (email = val)"
      />

      <TextAreaField
        :modelValue="body"
        v-model:error="bodyError"
        title="Write Comment"
        name="body"
        placeholder="Comment"
        @update:modelValue="(val) => (body = val)"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Add Comment</button>
        </div>

        <div class="control">
          <button type="reset" class="button is-link is-light" @click="emit('cancel')">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>
