<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">
        {{ needsRegistration ? 'Register' : 'Login' }}
      </h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            :class="{ 'is-danger': emailError }"
            placeholder="Enter your email"
            v-model="email"
            required
            @input="emailError = ''"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p v-if="emailError" class="help is-danger">{{ emailError }}</p>
      </div>

      <div v-if="needsRegistration" class="field">
        <label class="label" for="user-name">Your Name</label>
        <div class="control has-icons-left">
          <input
            type="text"
            id="user-name"
            name="name"
            class="input"
            :class="{ 'is-danger': nameError }"
            placeholder="Enter your name"
            v-model="name"
            required
            minlength="4"
            @input="nameError = ''"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
        <p v-if="nameError" class="help is-danger">{{ nameError }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }">
          {{ needsRegistration ? 'Register' : 'Login' }}
        </button>
      </div>

      <p v-if="serverError" class="help is-danger">{{ serverError }}</p>
    </form>
  </section>
</template>

<script>
import { getUserByEmail, createUser } from '../../api/users'

export default {
  name: 'LoginForm',
  emits: ['login'],
  data() {
    return {
      email: '',
      name: '',
      emailError: '',
      nameError: '',
      serverError: '',
      needsRegistration: false,
      isLoading: false,
    }
  },
  methods: {
    async handleSubmit() {
      this.serverError = ''

      if (!this.email.trim()) {
        this.emailError = 'Email is required'
        return
      }

      if (this.needsRegistration && (!this.name.trim() || this.name.trim().length < 4)) {
        this.nameError = 'Name must be at least 4 characters'
        return
      }

      this.isLoading = true

      try {
        if (this.needsRegistration) {
          // Processo de registro
          const user = await createUser({
            name: this.name.trim(),
            email: this.email.trim(),
          })

          this.$emit('login', user)
        } else {
          const users = await getUserByEmail(this.email.trim())

          if (users.length === 0) {
            this.needsRegistration = true
          } else {
            this.$emit('login', users[0])
          }
        }
      } catch (error) {
        this.serverError = 'Something went wrong. Please try again.'
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
