<script setup>
import { ref, onMounted, watch } from 'vue'
import { addComment } from '@/api/comments'
import InputField from './InputField.vue'
import TextAreaField from './TextAreaField.vue'

const { postId, formName, formEmail } = defineProps({
  postId: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  },
  formName: {
    type: String,
    default: '',
    validator: (value) => value.length <= 30
  },
  formEmail: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['closeForm', 'addComment'])

const name = ref('')
const email = ref('')
const body = ref('')

const errors = ref({
  name: '',
  email: '',
  body: ''
})

const isLoading = ref(false)

onMounted(() => {
  name.value = formName
  email.value = formEmail
})

watch([name, email, body], ([newName, newEmail, newBody]) => {
  if (newName) errors.value.name = ''
  if (newEmail) errors.value.email = ''
  if (newBody) errors.value.body = ''
})

const handleCloseForm = () => {
  emits('closeForm', { name: name.value, email: email.value })
}

const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email)
}
const handleSubmit = () => {
  errors.value.name = name.value ? '' : 'Name is required'

  if (!email.value) {
    errors.value.email = 'Email is required'
  }

  if (email.value && !validateEmail(email.value)) {
    errors.value.email = 'Invalid email format'
  }

  if (email.value && validateEmail(email.value)) {
    errors.value.email = ''
  }

  errors.value.body = body.value ? '' : 'Body is required'

  if (errors.value.name || errors.value.email || errors.value.body) {
    return
  }

  isLoading.value = true

  addComment({ postId, name: name.value, email: email.value, body: body.value })
    .then(({ data }) => {
      emits('addComment', data)
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      isLoading.value = false
      handleCloseForm()
    })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <InputField v-model="name" name="name" :error="errors.name" />
    <InputField v-model="email" name="email" :error="errors.email" />
    <TextAreaField v-model="body" name="comment" :error="errors.body" />
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Submit</button>
      </div>
      <div class="control">
        <button type="reset" @click="handleCloseForm" class="button is-link is-light">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
