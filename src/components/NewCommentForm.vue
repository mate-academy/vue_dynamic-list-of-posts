<script setup lang="ts">
import { ref } from 'vue'
import { ErrorMessages } from '@/utils/ErrorMessages'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

/**
 * Parent owns these values. We emit updates instead of keeping local refs.
 * `submitting` controls the loading state of the submit button.
 */
const props = defineProps<{
  name: string
  email: string
  body: string
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:name', v: string): void
  (e: 'update:email', v: string): void
  (e: 'update:body', v: string): void
  (e: 'submit', name: string, email: string, body: string): void
  (e: 'clear'): void
}>()

/** Local-only validation errors */
const nameError = ref('')
const emailError = ref('')
const bodyError = ref('')

const handleSubmit = () => {
  const nameTrimmed = props.name.trim()
  const emailTrimmed = props.email.trim()
  const bodyTrimmed = props.body.trim()

  nameError.value = ''
  emailError.value = ''
  bodyError.value = ''

  if (!nameTrimmed) nameError.value = ErrorMessages.Name_Is_Required
  if (!emailTrimmed) emailError.value = ErrorMessages.Email_Is_Empty
  if (!bodyTrimmed) bodyError.value = ErrorMessages.Comment_Is_Empty

  if (nameError.value || emailError.value || bodyError.value) return

  // Do NOT clear fields here; parent will clear only `body` on success.
  emit('submit', nameTrimmed, emailTrimmed, bodyTrimmed)
}

const handleClear = () => {
  // Clear all fields (parent state) and all local errors
  emit('update:name', '')
  emit('update:email', '')
  emit('update:body', '')
  nameError.value = ''
  emailError.value = ''
  bodyError.value = ''
  emit('clear')
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
        :disabled="submitting"
        @update:modelValue="(val) => emit('update:name', val)"
      />

      <InputField
        :modelValue="email"
        v-model:error="emailError"
        title="Author Email"
        name="email"
        type="email"
        placeholder="Your Email"
        icon="fa-envelope"
        :disabled="submitting"
        @update:modelValue="(val) => emit('update:email', val)"
      />

      <TextAreaField
        :modelValue="body"
        v-model:error="bodyError"
        title="Write Comment"
        name="body"
        placeholder="Comment"
        :disabled="submitting"
        @update:modelValue="(val) => emit('update:body', val)"
      />

      <div class="field is-grouped">
        <div class="control">
          <!-- Add is-loading while awaiting API -->
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': submitting }"
            :disabled="submitting"
          >
            Add Comment
          </button>
        </div>

        <div class="control">
          <!-- Clear button: clears fields and errors inside this component -->
          <button type="button" class="button is-light" :disabled="submitting" @click="handleClear">
            Clear
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>
