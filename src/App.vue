<template>
  <login :user="user" @addUser="addUser" v-if="loginPage" />
  <div v-else>
    <Header :user="user" v-if="user" @logout="Logout" />
    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <postsList :user="user" v-if="user" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from './component/header.vue'
import login from './component/login.vue'
import postsList from './component/postsList.vue'

export default {
  components: {
    Header,
    login,
    postsList,
  },
  data() {
    return {
      user: {},
      loading: false,
      loginPage: true,
    }
  },
  methods: {
    addUser($event) {
      this.user = { ...$event[0] }
      this.loginPage = false
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    Logout() {
      this.user = {}
      this.loginPage = true
      localStorage.removeItem('user')
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user')) || {}
    if (this.user.id) {
      this.loginPage = false
    }
  },
  watch: {
    user() {
      console.log(this.user)
    },
  },
}
</script>

<style></style>
