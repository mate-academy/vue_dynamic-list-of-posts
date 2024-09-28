<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Login from './views/LoginUser.vue'
import HeaderPost from './views/HeaderPost.vue'
import PostsList from './views/PostsList.vue'
import type { User } from './assets/types/User'
import { api } from './assets/api'

const user = ref<User | null>(null)
const isError = ref(false)
const needRegister = ref(false)

const saveUserLocaly = (incomingUser: User) => {
  user.value = incomingUser
  localStorage.setItem('user', JSON.stringify(incomingUser))
}

const onLogin = (email: string) => {
  api
    .getUser(email)
    .then((res) => {
      if (!res[0]) {
        needRegister.value = true
      } else {
        saveUserLocaly(res[0])
      }

      isError.value = false
    })
    .catch((err) => {
      isError.value = true
      throw err
    })
}

const logOut = () => {
  localStorage.removeItem('user')
  user.value = null
}

const onRegister = (email: string, name: string) => {
  api.postUser(email, name).then((res) => {
    saveUserLocaly(res)
  })
}

const loadUser = () => {
  const getUserFromStore = localStorage.getItem('user')

  if (getUserFromStore) {
    return JSON.parse(getUserFromStore) as User
  } else {
    return null
  }
}

onMounted(() => {
  user.value = loadUser()
})
</script>

<template>
  <Login
    @handleLogin="onLogin"
    @handleRegister="onRegister"
    :isError="isError"
    :needRegister="needRegister"
    v-if="!user"
  />
  <template v-else>
    <HeaderPost :user="user" :handleLogOut="logOut" />
    <main class="section">
      <div class="container">
        <PostsList :userId="user.id"/>
      </div>
    </main>
  </template>
</template>
