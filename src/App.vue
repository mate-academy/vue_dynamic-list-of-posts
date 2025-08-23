<template>
  <section>
    <HeaderLabel
      v-if="userId"
      :userName="userName"
      @logout="handleLogout"
    />
    
    <PostsSection v-if="userId" :userId="userId" />
    
    <LoginForm
      v-else
      @logged-in="handleLogin"
    />
  </section>
</template>

<script>
import HeaderLabel from './components/HeaderLabel.vue'
import PostsSection from './components/PostsSection.vue'
import LoginForm from './components/LoginForm.vue'

export default {
  name: 'App',
  components: { HeaderLabel, PostsSection, LoginForm },
  data() {
    return {
      userId: null,
      userName: '',
    }
  },
  methods: {
    handleLogin(user) {
      this.userId = user.id
      this.userName = user.name
    },
    handleLogout() {
      this.userId = null
      this.userName = ''
    },
  },
}
</script>
