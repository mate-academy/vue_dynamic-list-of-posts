<template>
  <LoginForm @login="handleLogin" />
</template>

<script>
import LoginForm from '../components/LoginForm.vue';
import { setUser } from '../store/userStore';

export default {
  name: 'LoginView',
  components: { LoginForm },
  methods: {
    // Quando o form de login emitir sucesso, salvamos no store e navegamos para posts
    handleLogin(user) {
      setUser(user);
      this.$router.push('/posts');
    },
  },
};
</script>
