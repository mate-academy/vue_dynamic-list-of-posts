<script>
import { validationRules } from '@/constants/validationRules'
import NeedToRegister from './NeedToRegister.vue'
import LoaderItem from '../LoaderItem.vue'

export default {
  name: 'LoginComponent',
  components: {
    NeedToRegister,
    LoaderItem,
  },
  data() {
    return {
      email: '',
      emailError: '',
    }
  },

  computed: {
    isNewUser() {
      return this.$store.state.auth.isNewUser
    },
    loading() {
      console.log(this.$store.state.auth.loading)

      return this.$store.state.auth.loading
    },
    errorMessage() {
      return this.$store.state.auth.errorMessage
    },
  },

  methods: {
    handleSubmit() {
      const errorMessage = validationRules.email(this.email)

      if (errorMessage.length > 0) {
        this.emailError = errorMessage
        return
      }

      this.$store.dispatch('authClient', this.email)
    },
  },

  mounted() {
    console.log(this.$store.state.auth.isNewUser)
  },
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" novalidate class="box mt-5">
      <h1 class="title is-3">You need to register</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            v-model="email"
            @input="emailError = ''"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p class="help is-danger" v-if="emailError">
          {{ emailError }}
        </p>
      </div>

      <NeedToRegister v-if="isNewUser" />

      <div class="field">
        <button v-if="!loading" type="submit" class="button is-primary">Login</button>
        <LoaderItem v-else />
      </div>
    </form>
  </section>
</template>
