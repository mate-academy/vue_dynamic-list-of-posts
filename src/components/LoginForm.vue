<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" style="min-width: 360px" @submit.prevent="handleSubmit">
      <h1 class="title is-3">Log in to continue</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            id="user-email"
            v-model.trim="email"
            type="email"
            name="email"
            class="input"
            :class="{ 'is-danger': error }"
            placeholder="Enter your email"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p v-if="error" class="help is-danger">{{ error }}</p>
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': loading }"
          :disabled="loading"
        >
          Login
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { usersApi } from '../api/index.js'

const emit = defineEmits(['login'])

const email = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!email.value) {
    error.value = 'Email is required'
    return
  }
  loading.value = true
  try {
    const users = await usersApi.getByEmail(email.value)
    if (!users.length) {
      error.value = 'User not found. Please check your email.'
      return
    }
    emit('login', users[0])
  } catch {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
