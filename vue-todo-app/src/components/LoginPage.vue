<script>
  import { addUser, getUserByEmail } from '../api/users'

  export default {
    name: 'LoginPage',
    data() {
      return {
        email: '',
        name: '',
        isNeedRegister: false,
        loading: false,
        errorMessage: '',
      }
    },
    emits: ['addUser'],
    methods: {
      handleLogin(email) {
        this.loading = true
        this.errorMessage = ''

        getUserByEmail(email)
          .then(({ data }) => {
            if (!data.length) {
              this.isNeedRegister = true
            } else {
              localStorage.setItem('user', JSON.stringify(data[0]))
              this.$emit('addUser', data)
            }
          })
          .catch(() => {
            this.errorMessage = 'Login failed. Try again later.'
          })
          .finally(() => {
            this.loading = false
          })
      },
      handleRegister() {
        this.loading = true
        this.errorMessage = ''

        const name = this.name
        const email = this.email

        addUser({ name, email })
          .then(() => {
            return this.handleLogin(email)
          })
          .catch(() => {
            this.errorMessage = 'Registration failed. Please check your data.'
          })
          .finally(() => {
            this.loading = false
          })
      },
    },
  }
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="isNeedRegister ? handleRegister() : handleLogin(email)" class="box mt-5">
      <h1 class="title is-3">
        {{ isNeedRegister ? 'You need to register' : 'Get your userId' }}
      </h1>

      <div v-if="!loading && errorMessage" class="notification is-danger is-light">
        {{ errorMessage }}
      </div>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left" :class="{ 'is-loading': loading }">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            :disabled="isNeedRegister"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>
      </div>

      <div v-if="isNeedRegister" class="field">
        <label class="label" htmlFor="user-name"> Your Name </label>

        <div class="control has-icons-left" :class="{ 'is-loading': loading }">
          <input
            v-model="name"
            type="text"
            id="user-name"
            name="name"
            class="input"
            placeholder="Enter your name"
            required
            minlength="4"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary" :class="{ 'is-loading': loading }">
          {{ isNeedRegister ? 'Register' : 'Login' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style></style>
