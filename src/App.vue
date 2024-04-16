<script>
import { login, register } from "./api/user";
import LoginForm from "./components/LoginForm.vue";
import Header from "./components/Header.vue";
import PostList from "./components/PostList.vue";
export default {
  components: {
    LoginForm,
    Header,
    PostList,
  },
  data() {
    return {
      isAuthorized: !!(JSON.parse(localStorage.getItem('user'))),
      name: '',
      email: '',
      user: JSON.parse(localStorage.getItem('user')),
      isSubmitted: false,
    };
  },
  methods: {
    handleLogin() {
      if (this.isSubmitted && !this.isAuthorized) {
        register(this.email, this.name)
        .then((res) => {
          this.user = res.data;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.isAuthorized = true;
          this.isSubmitted = true;
        })
        .catch(err => console.error(err));
        return;
      }
      login(this.email)
        .then((res) => {
          if (res.data.length === 0) {
            this.isAuthorized = false;
            return;
          }
          this.user = res.data[0];
          localStorage.setItem('user', JSON.stringify(this.user));
          this.isAuthorized = true;
        })
        .catch((err) => {
          
        })
        .finally(() => {
          this.isSubmitted = true;
        })
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
    <Header :user="this.user" @logout="logout" />
    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <PostList :user-id="this.user.id" />
        </div>
      </div>
    </main>
  </template>

</template>