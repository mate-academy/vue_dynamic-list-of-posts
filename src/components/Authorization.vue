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

const register = async () => {
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
    throw new Error(error)
  }
}

const login = async () => {
  if (!email.value.trim()) {
    emailError.value = ErrorMessages.Email_Is_Required
  }

  if (emailError.value) {
    return
  }

  try {
    const fetchedUser = (await getUser(email.value))[0]
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
  userNoRegistered.value ? register() : login()
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="submit">
      <h1 class="title is-3">Get your userId</h1>

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
