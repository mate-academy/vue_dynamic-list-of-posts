<script setup>
import { ref } from 'vue'
import InputField from '@/components/InputField.vue'
import { ErrorMessages } from '@/utils/ErrorMessages'
import { getUser, createUser } from '@/api/users'
import { setUser } from '@/utils/LocalStorage'

const user = defineModel('user', {
  type: Object,
})

const email = ref('')
const name = ref('')
const emailError = ref('')
const nameError = ref('')
const userNoRegistered = ref(false)
const globalError = ref('') // ✅ user-facing error message

const register = async () => {
  // reset errors for a fresh attempt
  globalError.value = ''
  nameError.value = ''
  emailError.value = ''

  if (!name.value.trim()) {
    nameError.value = ErrorMessages.Name_Is_Required
  }

  if (emailError.value || nameError.value) {
    return
  }

  try {
    const newUser = await createUser(email.value.trim(), name.value.trim())
    setUser(newUser)
    user.value = newUser
  } catch (error) {
    console.error('Register error:', error)
    globalError.value = 'Failed to register. Please try again later.'
  }
}

const login = async () => {
  // reset errors for a fresh attempt
  globalError.value = ''
  emailError.value = ''

  if (!email.value.trim()) {
    emailError.value = ErrorMessages.Email_Is_Required
  }

  if (emailError.value) {
    return
  }

  try {
    // getUser now returns User[]
    const fetchedUsers = await getUser(email.value.trim())
    const fetchedUser = fetchedUsers[0]

    if (!fetchedUser) {
      userNoRegistered.value = true
      return
    }

    setUser(fetchedUser)
    user.value = fetchedUser
  } catch (error) {
    console.error('Login error:', error)
    globalError.value = 'Failed to login. Please try again later.'
  }
}

// ✅ make submit async and await the calls
const submit = async () => {
  if (userNoRegistered.value) {
    await register()
  } else {
    await login()
  }
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="submit">
      <h1 class="title is-3">Get your userId</h1>

      <div v-if="globalError" class="notification is-danger is-light">
        {{ globalError }}
      </div>

      <InputField
        v-model="email"
        v-model:error="emailError"
        title="Email"
        placeholder="Enter your email"
        icon="fa-envelope"
        type="email"
      />

      <InputField
        v-if="userNoRegistered"
        v-model="name"
        v-model:error="nameError"
        title="Your name"
        placeholder="Enter your name"
        icon="fa-user"
      />

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ userNoRegistered ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style>
.title {
  font-weight: 600;
}

.label {
  font-weight: 700;
}

.button {
  border-radius: 4px;
  font-weight: 400;
}

.button.is-primary {
  color: #fff;
}
</style>
