<script>
import { getUserByEmail, createUser } from '@/api/users'
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      name: '',
      errors: {
        email: '',
        name: '',
        total: '',
      },
      isNeedRegister: false,
    }
  },
  emits: ['addUser'],
  methods: {
    validateEmail() {
      if (!this.email.trim().length) {
        this.errors.email = 'Email is required'
        return
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      if (!emailRegex.test(this.email)) {
        this.errors.email = 'Email is not valid'
        return
      }
    },
    validateName() {
      if (!this.name.trim().length) {
        this.errors.name = 'Name is required'
        return
      }

      if (this.name.trim().length < 2) {
        this.errors.name = 'Name must have at least 2 chars'
        return
      }
    },
    handleLogin() {
      this.validateEmail()

      if (this.errors.email) {
        return
      }

      getUserByEmail(this.email.trim())
        .then(({ data }) => {
          if (!data.length) {
            this.isNeedRegister = true

            return
          }

          this.$emit('addUser', data[0])
        })
        .catch((e) => {
          console.log(e)
          this.errors.total = 'Server Error. Try again later!'
        })
    },
    handleRegister() {
      this.validateEmail()
      this.validateName()

      if (this.errors.email || this.errors.name) {
        return
      }

      const name = this.name.trim()
      const email = this.email.trim()
      const username = null
      const phone = null

      createUser({ name, email, username, phone })
        .then(({ data }) => {
          this.$emit('addUser', data)
        })
        .catch((e) => {
          console.log(e)
          this.errors.total = 'Server Error. Try again later!'
        })
    },
  },
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form
      class="box mt-5"
      @submit.prevent="isNeedRegister ? handleRegister() : handleLogin()"
      novalidate
    >
      <h1 class="title is-3">{{ isNeedRegister ? 'You need to register' : 'Get your userId' }}</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left" :class="{ 'has-icons-right': errors.email }">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            :class="{ 'is-danger': errors.email }"
            placeholder="Enter your email"
            @input="errors.email = ''"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>

          <span class="icon is-small is-right has-text-danger" v-if="errors.email">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errors.email">{{ errors.email }}</p>
      </div>

      <div class="field" v-if="isNeedRegister">
        <label class="label" htmlFor="user-name"> Name </label>

        <div class="control has-icons-left" :class="{ 'has-icons-right': errors.name }">
          <input
            v-model="name"
            type="text"
            id="user-name"
            name="name"
            class="input"
            :class="{ 'is-danger': errors.name }"
            placeholder="Enter your name"
            @input="errors.name = ''"
          />

          <span class="icon is-small is-left">
            <i className="fas fa-user"></i>
          </span>

          <span class="icon is-small is-right has-text-danger" v-if="errors.name">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>

        <p class="help is-danger" v-if="errors.name">{{ errors.name }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ isNeedRegister ? 'Register' : 'Login' }}
        </button>
      </div>
      <p class="help is-danger" v-if="errors.total">{{ errors.total }}</p>
    </form>
  </section>
</template>
