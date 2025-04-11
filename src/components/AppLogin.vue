<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3" v-if="registerIsActive">You need to register</h1>
      <h1 class="title is-3" v-else>Get your userId</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left" :class="{ 'is-loading': loading }">
          <input type="email" id="user-email" name="email" class="input is-loading" placeholder="Enter your email"
            required v-model="userEmail" :disabled="registerIsActive || loading" />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <ErrorMessage v-if="loginErrorMessage"> {{ loginErrorMessage }} </ErrorMessage>
      </div>

      <NeedToRegister v-if="registerIsActive" v-model:registerNameModel="registerName" :loading="loading" />

      <div class="field">
        <button v-if="registerIsActive" :class="{ 'is-loading': loading }" type="submit"
          class="button is-primary isLoading">
          Register
        </button>
        <button v-else type="submit" :class="{ 'is-loading': loading }" class="button is-primary">
          Login
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { createUser, getUser } from '@/api/user'
import ErrorMessage from './ErrorMessage.vue'
import NeedToRegister from './NeedToRegister.vue'
import type { User } from '@/types/user'
import { type PropType } from 'vue'

export default {
  data(): {
    userEmail: string
    registerName: string
    registerIsActive: boolean
    loginErrorMessage: string
    loading: boolean
  } {
    return {
      userEmail: '',
      registerName: '',
      registerIsActive: false,
      loginErrorMessage: '',
      loading: false,
    }
  },
  components: {
    NeedToRegister,
    ErrorMessage,
  },
  props: {
    userIdModel: {
      type: Object as PropType<User | null>,
      required: false,
    },
  },
  emits: ['update:userModel'],
  methods: {
    handleSubmit() {
      this.loading = true

      if (!this.registerIsActive) {
        getUser(this.userEmail)
          .then((user) => {
            if (user) {
              this.$emit('update:userModel', user[0])
              this.saveInLocalStorage(user[0])
            } else {
              this.registerIsActive = true
            }
          })
          .catch((er) => {
            throw er
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        createUser(this.registerName, this.userEmail)
          .then((createdUser: User) => {
            this.$emit('update:userModel', createdUser)
            this.saveInLocalStorage(createdUser)
          })
          .catch((er) => {
            throw er
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    saveInLocalStorage(user: User) {
      localStorage.setItem('user', JSON.stringify(user))
    },
  },
}
</script>
