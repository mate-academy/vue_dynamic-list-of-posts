<script setup>
import { computed, ref } from 'vue'

import { createUser, findUserByEmail } from '@/api/users'
import FormField from './FormField.vue'

const emit = defineEmits(['login'])

const email = ref('')
const name = ref('')
const emailError = ref('')
const nameError = ref('')
const isLoading = ref(false)
const shouldAskName = ref(false)

const trimmedEmail = computed(() => email.value.trim())
const trimmedName = computed(() => name.value.trim())

const finishLogin = (user) => {
  console.log('User Logged In')
  emit('login', user)
}

const isUser = (value) => Boolean(value?.name)

const handleEmailUpdate = () => {
  emailError.value = ''
  nameError.value = ''
  name.value = ''
  shouldAskName.value = false
}

const handleClear = () => {
  email.value = ''
  name.value = ''
  emailError.value = ''
  nameError.value = ''
  shouldAskName.value = false
}

const validateEmail = () => {
  if (!trimmedEmail.value) {
    emailError.value = 'Email is required'

    return false
  }

  return true
}

const validateName = () => {
  if (!trimmedName.value) {
    nameError.value = 'Name is required'

    return false
  }

  if (trimmedName.value.length < 4) {
    nameError.value = 'Name should be at least 4 characters'

    return false
  }

  return true
}

const handleSubmit = async () => {
  emailError.value = ''
  nameError.value = ''

  if (!validateEmail()) {
    return
  }

  if (shouldAskName.value) {
    if (!validateName()) {
      return
    }

    isLoading.value = true

    try {
      const createdUser = await createUser({
        email: trimmedEmail.value,
        name: trimmedName.value,
      })

      finishLogin(createdUser)
    } catch (error) {
      nameError.value = error.message
    } finally {
      isLoading.value = false
    }

    return
  }

  isLoading.value = true

  try {
    const foundUser = await findUserByEmail(trimmedEmail.value)

    if (isUser(foundUser)) {
      finishLogin(foundUser)

      return
    }

    shouldAskName.value = true
  } catch (error) {
    emailError.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="handleSubmit">
      <h1 class="title is-3">You need to register</h1>

      <FormField
        id="user-email"
        v-model="email"
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        icon="fas fa-envelope"
        :error="emailError"
        @update:model-value="handleEmailUpdate"
      />

      <FormField
        v-if="shouldAskName"
        id="user-name"
        v-model="name"
        label="Your Name"
        name="name"
        placeholder="Enter your name"
        icon="fas fa-user"
        :error="nameError"
        :minlength="4"
        @update:model-value="nameError = ''"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }">
            Login
          </button>
        </div>

        <div class="control">
          <button type="button" class="button is-primary is-light" @click="handleClear">Clear</button>
        </div>
      </div>
    </form>
  </section>
</template>
