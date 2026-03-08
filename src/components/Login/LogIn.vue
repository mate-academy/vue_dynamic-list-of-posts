<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getUserByEmail, createUser } from '../../api/posts'
import type { User } from '../../api/posts'

export default defineComponent({
  emits: ['login'],

  setup(_, { emit }) {
    const email = ref('')
    const name = ref('')
    const emailError = ref('')
    const nameError = ref('')
    const isLoading = ref(false)
    const needsRegister = ref(false)

    async function handleSubmit() {
      emailError.value = ''
      nameError.value = ''

      if (!email.value.trim()) {
        emailError.value = 'Email is required'
        return
      }

      if (needsRegister.value && !name.value.trim()) {
        nameError.value = 'Name is required'
        return
      }

      isLoading.value = true

      try {
        if (needsRegister.value) {
          // Register new user
          const newUser: User = await createUser({
            name: name.value.trim(),
            email: email.value.trim(),
          })
          emit('login', newUser)
        } else {
          // Find existing user by email
          const user = await getUserByEmail(email.value.trim())

          if (user) {
            emit('login', user)
          } else {
            // User not found — show name field to register
            needsRegister.value = true
          }
        }
      } catch {
        emailError.value = 'Something went wrong. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      name,
      emailError,
      nameError,
      isLoading,
      needsRegister,
      handleSubmit,
    }
  },
})
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <div class="box mt-5">
      <h1 class="title is-3">
        {{ needsRegister ? 'You need to register' : 'Login' }}
      </h1>

      <!-- Email field -->
      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            id="user-email"
            v-model="email"
            type="email"
            name="email"
            class="input"
            :class="{ 'is-danger': emailError }"
            placeholder="Enter your email"
            @input="emailError = ''"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>
        <p v-if="emailError" class="help is-danger">{{ emailError }}</p>
      </div>

      <!-- Name field — shown only when registering -->
      <div v-if="needsRegister" class="field">
        <label class="label" for="user-name">Your Name</label>
        <div class="control has-icons-left">
          <input
            id="user-name"
            v-model="name"
            type="text"
            name="name"
            class="input"
            :class="{ 'is-danger': nameError }"
            placeholder="Enter your name"
            minlength="4"
            @input="nameError = ''"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>
        <p v-if="nameError" class="help is-danger">{{ nameError }}</p>
      </div>

      <div class="field">
        <button
          type="button"
          class="button is-primary"
          :class="{ 'is-loading': isLoading }"
          @click="handleSubmit"
        >
          {{ needsRegister ? 'Register' : 'Login' }}
        </button>
      </div>
    </div>
  </section>
</template>
