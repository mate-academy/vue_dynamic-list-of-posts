<script setup>
import { getUser, registerUser } from '@/api/users'
import { ref } from 'vue'

const emit = defineEmits(['login'])

const email = ref('')
const name = ref('')

const isRegister = ref(false)
const isLoading = ref(false)
const isError = ref(false)

const startLoading = () => {
  isError.value = false
  isLoading.value = true
}

const handleLogin = (email) => {
  startLoading()

  getUser(email)
    .then(({ data }) => {
      if (!data.length) {
        isRegister.value = true
      }

      if (data.length) {
        localStorage.setItem('user', JSON.stringify(data[0]))

        emit('login', data[0])
      }
    })
    .catch(() => {
      isError.value = true
    })
    .finally(() => {
      isLoading.value = false
      setTimeout(() => {
        isError.value = false
      }, 5000)
    })
}

const handleRegister = () => {
  startLoading()

  registerUser({ email: email.value, name: name.value })
    .then(() => {
      handleLogin(email.value)
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="isRegister ? handleRegister() : handleLogin(email)" class="box mt-5">
      <h1 class="title is-3">{{ isRegister ? 'You need to register' : 'Get your userId' }}</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            :disabled="isRegister"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p class="help is-danger" :class="{ 'is-hidden': !isError }">
          Login failed. Please try again.
        </p>
      </div>

      <div v-if="isRegister" class="field">
        <label class="label" htmlFor="user-name"> Your name </label>

        <div class="control has-icons-left">
          <input
            v-model="name"
            type="text"
            id="user-name"
            name="name"
            className="input"
            placeholder="Enter your name"
            minlength="4"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }">
          {{ isRegister ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>
