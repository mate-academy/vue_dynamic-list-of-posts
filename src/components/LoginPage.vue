<script setup>
import { getUser, registerUser } from '@/api/users'
import { ref } from 'vue'

const email = ref('')
const name = ref('')

const isRegister = ref(false)
const isLoading = ref(false)
const isError = ref(false)

const emit = defineEmits(['login'])

const handleLogin = (email) => {
  isError.value = false
  isLoading.value = true
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
  isError.value = false
  isLoading.value = true
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
  <section className="container is-flex is-justify-content-center">
    <form @submit.prevent="isRegister ? handleRegister() : handleLogin(email)" className="box mt-5">
      <h1 className="title is-3">{{ isRegister ? 'You need to register' : 'Get your userId' }}</h1>

      <div className="field">
        <label className="label" htmlFor="user-email"> Email </label>

        <div className="control has-icons-left">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            className="input"
            placeholder="Enter your email"
            :disabled="isRegister"
            required
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
        </div>

        <p class="help is-danger" :class="{ 'is-hidden': !isError }">
          Login failed. Please try again.
        </p>
      </div>

      <div v-if="isRegister" className="field">
        <label className="label" htmlFor="user-name"> Your name </label>

        <div className="control has-icons-left">
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

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>
        </div>
      </div>

      <div className="field">
        <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }">
          {{ isRegister ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>
