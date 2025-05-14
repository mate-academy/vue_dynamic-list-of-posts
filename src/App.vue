<<<<<<< HEAD
<script setup>
import AuthenticatedContent from './components/AuthenticatedContent.vue'
import AuthUser from './components/AuthUser.vue'
import { ref } from 'vue'
import { getUser } from './utils/UserLocaleStorage'
const user = ref(getUser());
console.log(user.value)
</script>

<template>
  <AuthUser v-if="!user" v-model:user="user" />
  <AuthenticatedContent v-else v-model:user="user" />
</template>
<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
  @media (min-width: 769px) {
    max-width: 0;
  }
}
.Sidebar--open {
  opacity: 1;
  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>
=======
<script>
import PostList from "./components/PostList.vue";
import Header from "./components/Header.vue";
import LoginPage from "./components/LoginPage.vue";
export default {
  components: {
    PostList,
    Header,
    LoginPage,
  },
  data() {
    return {
      user: {},
      isActiveLoginPage: true,
    };
  },
  watch: {
    user() {
      console.log(this.user);
    },
  },
  mounted() {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      this.user = savedUser;
      this.isActiveLoginPage = false;
    }
  },
  methods: {
    addUser($event) {
      this.user = { ...$event[0] };
      this.isActiveLoginPage = false;
    },
    logout() {
      localStorage.removeItem("user");
      this.user = {};
      this.isActiveLoginPage = true;
    },
  },
};
</script>

<template>
  <LoginPage v-if="isActiveLoginPage" @addUser="addUser" />

  <template v-else>
    <Header :user="user" @logout="logout" />

    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostList :userId="user.id" />
        </div>
      </div>
    </main>
  </template>
</template>

<style></style>
>>>>>>> ab7d773b45522c29aeda20e2620c8a9a6e91ab22
