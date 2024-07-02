<script lang="ts">
import { useUserStore } from '@/stores/users'
import ButtonTemplate from '@/ui/buttonTemplate.vue'
import InputTemplate from '@/ui/inputTemplate.vue'

export default {
  components: { InputTemplate, ButtonTemplate },

  data() {
    return {
      userEmail: '',
      userEmailError: false,
      userName: '',
      userNameError: false,
      submitting: false,
      userNeedToBeRegistered: false
    }
  },

  methods: {
    async handleSubmit() {
      this.submitting = true

      this.userEmailError = !this.userEmail.trim()

      if (!this.userEmail.trim()) {
        this.submitting = false
        return
      }

      const user = useUserStore()

      const existUser = await user.hasUserInDB(this.userEmail)

      if (!existUser) {
        this.userNeedToBeRegistered = true
        this.submitting = false

        return
      }
      this.submitting = false

      this.$router.push({ path: '/', replace: true })
    },

    async handleRegisterSubmit() {
      this.submitting = true

      this.userNameError = !this.userName.trim()

      if (!this.userName.trim()) {
        this.submitting = false
        return
      }

      const userStore = useUserStore()
      userStore.user.email = this.userEmail
      userStore.user.name = this.userName
      userStore.isUserAuthenticated = true

      this.userEmail = ''
      this.userName = ''
      this.submitting = false

      this.$router.push({ path: '/', replace: true })
    }
  }
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form class="box mt-5" @submit.prevent="handleRegisterSubmit" v-if="userNeedToBeRegistered">
      <h1 class="title is-3">You need to register</h1>

      <InputTemplate
        label="Email"
        v-model="userEmail"
        :error="userEmailError"
        id="user-email"
        name="email"
        placeholder="Enter your email"
        errorMessage="Email is required"
        icon="fa-envelope"
        :disabled="userNeedToBeRegistered"
      />

      <InputTemplate
        label="Your Name"
        v-model="userName"
        :error="userNameError"
        id="user-name"
        name="name"
        placeholder="Enter your name"
        errorMessage="Name is required"
        icon="fa-user"
        minLength="4"
      />

      <div class="field">
        <ButtonTemplate
          buttonType="submit"
          class="is-primary has-text-white"
          :submitting="submitting"
          label="Register"
        />
      </div>
    </form>

    <form class="box mt-5" @submit.prevent="handleSubmit" v-else>
      <h1 class="title is-3">Get your userId</h1>

      <InputTemplate
        label="Email"
        v-model="userEmail"
        :error="userEmailError"
        id="user-email"
        name="email"
        placeholder="Enter your email"
        errorMessage="Email is required"
        icon="fa-envelope"
      />

      <div class="field">
        <ButtonTemplate
          buttonType="submit"
          class="is-primary has-text-white"
          :submitting="submitting"
          label="Login"
        />
      </div>
    </form>
  </section>
</template>
