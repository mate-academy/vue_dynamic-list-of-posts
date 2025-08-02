<script setup lang="ts">
import { ref } from 'vue'
import { getUserByEmail, addUser } from '../api/users.ts'

const isRegistred = ref(true)
const email = ref('')
const name = ref('')
const error = ref('')
const nameError = ref('')

import { defineEmits } from 'vue'

const emit = defineEmits(['loginSuccess'])

const handleSubmit = async () => {
  error.value = ''
  nameError.value = ''

  const userEmail = email.value.trim()

  if (!userEmail) {
    error.value = 'Email is required'
    return
  }

  if (!isRegistred.value) {
    if (!name.value.trim()) {
      nameError.value = 'Name is required'
      return
    }

    try {
      const res = await addUser({ name: name.value, email: userEmail })
      localStorage.setItem('user', JSON.stringify(res.data[0]))
      console.log('User registered successfully')
      isRegistred.value = true
      emit('loginSuccess')
    } catch (regError) {
      console.error('Registration error:', regError)
      error.value = 'Registration failed. Please try again.'
    }

    return
  }

  try {
    const res = await getUserByEmail(userEmail)
    const users = res.data

    if (!users.length) {
      isRegistred.value = false
      error.value = 'Can not find user with this email'
    } else {
      localStorage.setItem('user', JSON.stringify(users[0]))
      emit('loginSuccess')
      console.log('User logged in successfully')
    }
  } catch (fetchError) {
    console.error('Fetching user failed:', fetchError)
    error.value = 'Something went wrong. Please try again.'
  }
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 v-if="isRegistred" class="title is-3">Get your userId</h1>
      <h1 v-else class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label" for="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            v-model="email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p class="help is-danger">{{ error }}</p>
      </div>

      <div v-if="!isRegistred" class="field">
        <label class="label" for="user-email"> Your Name </label>

        <div class="control">
          <input
            type="text"
            id="user-name"
            name="name"
            class="input"
            placeholder="Enter your name"
            v-model="name"
            required
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>
        </div>

        <p v-if="nameError" class="help is-danger">{{ nameError }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ isRegistred ? 'Login' : 'Register' }}
        </button>
      </div>
    </form>
  </section>
</template>
