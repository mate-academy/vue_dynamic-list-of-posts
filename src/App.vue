<script>
import { getUserByEmail } from "./api/users";
import { getLocaleStorage } from "./utils/getLocaleStorage";
import Login from "./components/Login.vue";
import MainContent from "./components/MainContent.vue";

export default {
  name: "App",
  components: {
    Login,
    MainContent,
  },
  data() {
    return {
      needLogin: true,
    };
  },
  beforeMount() {
    const user = getLocaleStorage("user");

    if (user) {
      this.gettingUser(user.email);
    } else {
      this.needLogin = true;
    }
  },

  methods: {
    gettingUser(email) {
      getUserByEmail(email)
        .then(({ data }) => {
          if (data.length !== 0) {
            this.$store.commit("setUserId", data[0].id);
            this.needLogin = false;
          }
        })
        .catch(() => {
          console.log("err", err);
        });
    },
  },
};
</script>

<template>
  <Login v-if="needLogin" @login="needLogin = false" />
  <MainContent v-else @logout="needLogin = true"/>
</template>

<style></style>
