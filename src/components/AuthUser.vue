<script setup>
import { ref } from 'vue'
import { PatternEmail } from '@/utils/EmailPattern.js'
import { ErrorMessages } from '@/utils/ErrorMessages.js'
import { createUser, getUserByEmail, getUsers } from '@/api/users'
import { setUser } from '@/utils/UserLocaleStorage'
import InputField from './InputField.vue'

const user = defineModel('user', {
  type: Object,
})

const INITIAL_ERRORS = {
  emailError: ErrorMessages.None,
  nameError: ErrorMessages.None,
}

const email = ref('')
const name = ref('')
const isLoading = ref(false)
const errors = ref({ ...INITIAL_ERRORS })
const userNoRegistered = ref(false)

const registerUser = async () => {
  isLoading.value = true
  errors.value = { ...INITIAL_ERRORS }
  if (!email.value.trim()) {
    errors.value.emailError = ErrorMessages.Email_Is_Required
  } else if (!PatternEmail.test(email.value)) {
    errors.value.emailError = ErrorMessages.Email_Is_Invalid
  }
  if (!name.value.trim()) {
    errors.value.nameError = ErrorMessages.Name_Is_Required
  }

  if (errors.value.emailError || errors.value.nameError) {
    return
  }

  try {
    const allUsers = await getUsers()
    const existedUser = allUsers.find((user) => user.name === name.value.trim())
    if (existedUser) {
      errors.value.nameError = ErrorMessages.User_Already_Exists
      return
    }
    const newUser = await createUser(email.value.trim(), name.value.trim())
    setUser(newUser)
    user.value = newUser
  } catch (error) {
    throw new Error(error)
  } finally {
    isLoading.value = false
  }
}

const loginUser = async () => {
  errors.value = {
    ...INITIAL_ERRORS,
  }
  if (!email.value.trim()) {
    errors.value.emailError = ErrorMessages.Email_Is_Required
  } else if (!PatternEmail.test(email.value)) {
    errors.value.emailError = ErrorMessages.Email_Is_Invalid
  }

  if (errors.value.emailError || errors.value.nameError) {
    return
  }

  try {
    const fetchedUser = (await getUserByEmail(email.value))[0]
    if (!fetchedUser) {
      userNoRegistered.value = true

      return
    } else {
      setUser(fetchedUser)
      user.value = fetchedUser
    }
  } catch (error) {
    throw new Error(error)
  }
}

const submit = () => {
  userNoRegistered.value ? registerUser() : loginUser()
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="submit">
      <h1 class="title is-3">Get your userId</h1>
      <InputField
        v-model="email"
        v-model:error="errors.emailError"
        title="Email"
        placeholder="Type your email"
        icon="fa-envelope"
        :disabled="userNoRegistered"
        type="email"
      />
      <InputField
        v-if="userNoRegistered"
        v-model="name"
        v-model:error="errors.nameError"
        title="your name"
        placeholder="Type your name"
        icon="fa-user"
      />

      <div class="field">
        <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }">
          {{ userNoRegistered ? 'register' : 'login' }}
        </button>
      </div>
    </form>
  </section>
</template>
