<template>
  <LoginForm @login="handleLogin" />
</template>

<script>
import LoginForm from '../components/forms/LoginForm.vue'
import { setUser } from '../store/userStore'

export default {
  name: 'LoginView',
  components: { LoginForm },
  methods: {
    handleLogin(user) {
      setUser(user)
      this.$router.push('/posts')
    },
  },
}
</script>
