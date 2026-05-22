<template>
  <form @submit.prevent="handleSubmit" @reset="handleClear">
    <InputField
      v-model="name"
      id="comment-author-name"
      name="name"
      label="Author Name"
      placeholder="Your name"
      icon-class="fas fa-user"
      :error="errors.name"
      @clear-error="errors.name = ''"
    />

    <InputField
      v-model="email"
      id="comment-author-email"
      name="email"
      label="Author Email"
      placeholder="Your email"
      type="email"
      icon-class="fas fa-envelope"
      :error="errors.email"
      @clear-error="errors.email = ''"
    />

    <TextAreaField
      v-model="body"
      id="comment-body"
      name="body"
      label="Comment Text"
      placeholder="Write your comment..."
      :error="errors.body"
      @clear-error="errors.body = ''"
    />

    <div v-if="submitError" class="notification is-danger is-light mb-3">
      {{ submitError }}
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': loading }"
          :disabled="loading"
        >
          Add
        </button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light" :disabled="loading">
          Clear
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  submitError: { type: String, default: '' },
})
const emit = defineEmits(['submit'])

const name = ref('')
const email = ref('')
const body = ref('')
const errors = ref({ name: '', email: '', body: '' })

function validate() {
  let valid = true
  errors.value = { name: '', email: '', body: '' }
  if (!name.value.trim()) { errors.value.name = 'Name is required'; valid = false }
  if (!email.value.trim()) { errors.value.email = 'Email is required'; valid = false }
  if (!body.value.trim()) { errors.value.body = 'Comment is required'; valid = false }
  return valid
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', { name: name.value.trim(), email: email.value.trim(), body: body.value.trim() })
}

function handleClear() {
  name.value = ''
  email.value = ''
  body.value = ''
  errors.value = { name: '', email: '', body: '' }
}

defineExpose({ resetBody: () => { body.value = ''; errors.value.body = '' } })
</script>
