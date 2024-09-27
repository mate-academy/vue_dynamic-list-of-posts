<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
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

const form = reactive({
  name: '',
  email: '',
  body: '',
  errors: {
    name: '',
    email: '',
    body: ''
  }
})

const isLoading = ref(false)

onMounted(() => {
  form.name = formName
  form.email = formEmail
})

watch([() => form.name, () => form.email, () => form.body], ([newName, newEmail, newBody]) => {
  if (newName) form.errors.name = ''
  if (newEmail) form.errors.email = ''
  if (newBody) form.errors.body = ''
})

const handleCloseForm = () => {
  emits('closeForm', { name: form.name, email: form.email })
}

const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email)
}
const handleSubmit = () => {
  form.errors.name = form.name ? '' : 'Name is required'

  if (!form.email) {
    form.errors.email = 'Email is required'
  }

  if (form.email && !validateEmail(form.email)) {
    form.errors.email = 'Invalid email format'
  }

  if (form.email && validateEmail(form.email)) {
    form.errors.email = ''
  }

  form.errors.body = form.body ? '' : 'Body is required'

  if (Object.values(form.errors).some((error) => error)) {
    return
  }

  isLoading.value = true

  addComment({ postId, name: form.name, email: form.email, body: form.body })
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
    <InputField v-model="form.name" name="name" :error="form.errors.name" />
    <InputField v-model="form.email" name="email" :error="form.errors.email" />
    <TextAreaField v-model="form.body" name="comment" :error="form.errors.body" />
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
