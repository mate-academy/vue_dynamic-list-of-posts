<script lang="ts">
import Loader from './LoadingView.vue'
export default {
  components: {
    Loader,
  },
  data() {
    return {
      email: '',
      name: '',
      first: false,
      logged: false,
      isLoading: false,
      isError: false,
      err: '',
      dados: [],
    }
  },
  methods: {
    async submit() {
      const email = this.dados.find((e) => e.email === this.email)
      if (email) {
        this.logged = true
        localStorage.setItem('emLogin', this.email)
        window.location.reload()
        return
      } else {
        if (!email && this.name === '') {
          this.first = true
        } else if (this.name !== '') {
          const newUser = {
            name: this.name,
            email: this.email,
          }
          fetch('https://mate-academy.github.io/fe-students-api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(newUser),
          })
            .then((response) => response.json())
            .then((newUser) => {
              this.dados.push(newUser)
              localStorage.setItem('emLogin', this.email)
              localStorage.setItem('emName', this.name)
              window.location.reload()
            })
            .catch((error) => {
              console.log(error)
            })
        }
      }
    },
  },
  async mounted() {
    try {
      const dado = await fetch('https://mate-academy.github.io/fe-students-api/users')
      this.dados = await dado.json()
    } catch (error) {
      this.isError = true
      this.err = error
    }
  },
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="submit" class="box mt-5" v-if="!isLoading">
      <h1 class="title is-3">You need to register</h1>

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
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p v-if="isError" class="help is-danger">{{ err }}</p>
      </div>

      <div class="field" v-if="first">
        <label class="label" for="user-name"> Your Name </label>

        <div class="control has-icons-left">
          <input
            type="text"
            id="user-name"
            name="name"
            class="input"
            placeholder="Enter your name"
            required
            minlength="4"
            v-model="name"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>

        <p v-if="isError" class="help is-danger">{{ err }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary" :class="isLoading ? 'is-loading' : ''">
          Login
        </button>
      </div>
    </form>
    <Loader v-else />
  </section>
</template>
