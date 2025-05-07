<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['authStatus'])

const showName = ref(false)
const userEmail = ref('')
const userName = ref('')
const isEmailValid = ref(false)
const showError = ref(false)

const handleLogin = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  isEmailValid.value = emailRegex.test(userEmail.value)
  const doesUserExist = localStorage.getItem('email') || '';

  if (doesUserExist === userEmail.value) {
    emit('authStatus', true)
  }

  if (isEmailValid.value) {
    localStorage.setItem('email', userEmail.value)
    showName.value = true
    isEmailValid.value = true
  } else {
    showError.value = true
  }
}

const handleRegister = () => {
  console.log('Username:', userName.value);

  if (userName.value.length > 3) {
    localStorage.setItem('name', userName.value)
    showError.value = false
    emit('authStatus', true)
  } else {
    showError.value = true
  }
}

const handleFocus = () => {
  showError.value = false
}

console.log(isEmailValid.value)
</script>

<template>
  <section className="container is-flex is-justify-content-center">
    <form className="box mt-5">
      <h1 className="title is-3">Get your userID</h1>

      <div className="field">
        <label className="label" htmlFor="user-email"> Email </label>

        <div className="control has-icons-left mb-3">
          <input
            type="email"
            id="user-email"
            name="email"
            className="input"
            placeholder="Enter your email"
            v-model="userEmail"
            @focus="handleFocus"
            required
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope"></i>
          </span>
        </div>

        <p v-if="showError && !isEmailValid" className="help is-danger">
          Set invalid value into 'Email' field (e.g., 'test@domain')
        </p>

        <div v-if="showName">
          <label className="label" htmlFor="user-name"> Name </label>

          <div className="control has-icons-left">
            <input
              type="text"
              id="user-name"
              name="userName"
              className="input"
              placeholder="Enter your name"
              v-model="userName"
              @focus="handleFocus"
              required
            />

            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
            </span>
          </div>

          <p v-if="showError && isEmailValid" className="help is-danger">
            Invalid name. Length shoul be bigger than 4 chracters.
          </p>
        </div>
      </div>

      <div className="field">
        <div v-if="!isEmailValid">
          <button
            type="submit"
            className="button is-primary"
            @click.prevent="handleLogin"
          >
            Login
          </button>
        </div>

        <div v-if="isEmailValid">
          <button
            type="submit"
            className="button is-primary"
            @click.prevent="handleRegister"
          >
            Register
          </button>
        </div>
      </div>
    </form>
  </section>
</template>
