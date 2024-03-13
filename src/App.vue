<template>
  <div>
    <AppLogin v-if="user.length === 0" @handleGetUser="fetchUser" />

    <div v-else class="app">
      <AppHeader  @logout="logout" />
      <PostsList :userId="skipProxyForId()" />
    </div>
  </div>
</template>

<script>
import PostsList from "./components/PostsList/PostsList";
import AppHeader from "./components/AppHeader/AppHeader";
import AppLogin from "./components/Login/AppLogin";
import { getUser } from "./api/User";

export default {
  name: "App",
  components: {
    PostsList,
    AppHeader,
    AppLogin,
  },

  data() {
    return {
      user: [],
    };
  },

  mounted() {
    this.fetchUser();
  },

  methods: {
    async fetchUser(email) {
      try {
        let userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && Object.keys(userData).length > 0) {
          this.user = userData;
        } else {
          const { data } = await getUser(email);
          if (data && Object.keys(data).length > 0) {
            this.user = data;
            localStorage.setItem("userData", JSON.stringify(data));
            localStorage.setItem("userEmail", email);
          } else {
            console.error("User data is empty or not found");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    skipProxyForId() {
      return this.user.map((u) => u.id);
    },

    logout() {
      this.user = [];
      localStorage.removeItem("userData");
      localStorage.removeItem("userEmail");
    },
  },
};
</script>
