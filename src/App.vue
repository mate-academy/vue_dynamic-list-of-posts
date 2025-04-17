<script>
import Header from "./components/Header.vue";
import LoginForm from "./components/LoginForm.vue";
import PostList from "./components/PostList.vue";
import { loginUser, registerUser } from "./api/user";
export default {
  components: {
    LoginForm,
    Header,
    PostList,
  },
  data() {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      isAuthorized: !!user,
      user,
      name: '',
      email: '',
      isSubmitted: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        let userData;
        if (this.isSubmitted && !this.isAuthorized) {
          userData = await this.registerUser();
        } else {
          userData = await this.loginUser();
        }
        if (userData) {
          this.setUser(userData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.isSubmitted = true;
      }
    },
    async loginUser() {
      const { data } = await loginUser(this.email);
      if (data.length === 0) {
        this.isAuthorized = false;
        return null;
      }
      return data[0];
    },
    async registerUser() {
      const { data } = await registerUser(this.email, this.name);
      return data;
    },
    setUser(user) {
      this.user = user;
      this.isAuthorized = true;
      localStorage.setItem('user', JSON.stringify(user));
    },
    changeName(value) {
      this.name = value;
    },
    changeEmail(value) {
      this.email = value;
    },
    logout() {
      this.user = null;
      this.isAuthorized = false;
      localStorage.removeItem("user");
    },
  },
};
</script>

<template>
  <LoginForm 
    v-if="!isAuthorized" 
    @handle-submit="handleLogin" 
    :is-authorized="isAuthorized" 
    :is-submitted="isSubmitted"
    @change-name="changeName" 
    @change-email="changeEmail" 
  />
  <template v-else>
    <Header :user="user" @logout="logout" />
    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostList :user-id="user.id" />
        </div>
      </div>
    </main>
  </template>
</template>
