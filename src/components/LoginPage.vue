<script>
import { addUser, getUserByEmail } from "@/api/users";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      name: "",
      isNeedRegister: false,
    };
  },
  emits: ["addUser"],
  methods: {
    handleLogin(email) {
      getUserByEmail(email).then(({ data }) => {
        if (!data.length) {
          this.isNeedRegister = true;
        } else {
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data[0]));
          this.$emit("addUser", data);
        }
      });
    },
    handleRegister() {
      const name = this.name;
      const email = this.email;
      const username = this.username || null;
      const phone = this.phone || null;
      addUser({ name, username, email, phone });
      this.handleLogin(email);
    },
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form
      @submit.prevent="isNeedRegister ? handleRegister() : handleLogin(email)"
      class="box mt-5"
    >
      <h1 class="title is-3">
        {{ isNeedRegister ? "You need to register" : "Get your userId" }}
      </h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            :disabled="isNeedRegister"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>
      </div>

      <div v-if="isNeedRegister" class="field">
        <label class="label" htmlFor="user-name"> Your Name </label>

        <div class="control has-icons-left">
          <input
            v-model="name"
            type="text"
            id="user-name"
            name="name"
            class="input"
            placeholder="Enter your name"
            required
            minlength="{4}"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ isNeedRegister ? "Register" : "Login" }}
        </button>
      </div>
    </form>
  </section>
</template>

<script></script>