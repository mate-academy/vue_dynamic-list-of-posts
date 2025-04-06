<!-- eslint-disable vue/no-reserved-component-names -->
<script>
import Header from './components/Header.vue'
import LoginPage from './components/LoginPage.vue'
import PostsList from './components/PostsList.vue'
export default {
  components: {
    LoginPage,
    Header,
    PostsList,
  },
  data() {
    return {
      user: {},
    }
  },
  mounted() {
    const userInLocalStorage = JSON.parse(localStorage.getItem('user'))
    if (userInLocalStorage) {
      this.user = userInLocalStorage
    }
  },
  methods: {
    handleSaveUser(user) {
      localStorage.setItem('user', JSON.stringify(user))
      this.user = user
    },
    handleRemoveUser() {
      localStorage.removeItem('user')
      this.user = {}
    },
  },
}
</script>

<template>
  <LoginPage v-if="!user.hasOwnProperty('id')" @addUser="handleSaveUser" />

  <template v-else>
    <Header :user="user" @log-out="handleRemoveUser" />
    <main class="section">
      <div class="container">
        <div class="tile is-ancestor is-flex is-flex-wrap-wrap">
          <PostsList :user-id="user.id" />
        </div>
      </div>
    </main>
  </template>
</template>

<style></style>
