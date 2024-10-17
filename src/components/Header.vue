<script>
import { getLocaleStorage } from "@/utils/getLocaleStorage";

export default {
  name: "Header",
  data() {
    return {
      userName: "",
    };
  },
  emits: ["logout"],
  beforeMount() {
    const user = getLocaleStorage("user");
    this.userName = user.name;
  },
  methods: {
    logout() {
      window.localStorage.removeItem("user");
      this.$store.commit("setUserId", null);
      this.$store.commit("addPostList", []);
      this.$emit("logout");
    },
  },
};
</script>

<template>
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-item">
      <h2 className="is-size-4">Vue List Of Posts</h2>
    </div>
    <div className="navbar-end">
      <div className="navbar-item">
        <div className="buttons">
          <div className="mr-5 mb-2">
            <p>{{ `User: ${userName}` }}</p>
          </div>

          <a className="button is-light" @click="logout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>
