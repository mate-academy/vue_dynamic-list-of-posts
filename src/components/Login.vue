<script>
import { createUser, findUser } from "@/http-client";
import NeedToRegister from "./NeedToRegister.vue";

export default {
  name: "Login",
  components: {
    NeedToRegister,
  },
  props: {
    modelValue: Object,
  },

  emits: ["update:modelValue"],

  data() {
    return {
      email: "",
      userDoesNotExist: false,
      userName: null,
      userFound: null,
    };
  },
  watch: {
    userName() {
      console.log(this.userName);
    },
  },
  computed: {
    formText() {
      return this.userDoesNotExist === true
        ? "You need to register"
        : "Get your userId";
    },
  },
  methods: {
    handleSubmit() {
      if (this.userDoesNotExist && this.userName?.length > 0) {
        this.logUserIn();
        return;
      }

      findUser(this.email).then((user) => {
        if (user === null) {
          this.userDoesNotExist = true;
        } else {
          this.userFound = user;
          this.logUserIn();
        }
      });
    },
    async logUserIn() {
      if (this.userFound === null) {
        // Create the user
        createUser(this.userName, this.email)
          .then((response) => this.$emit("update:modelValue", response.data))
          .catch((error) => console.log("Error:", error));
      } else {
        // this.user = this.userFound;
        this.$emit("update:modelValue", this.userFound);
      }
    },
  },
};
</script>

<template>
  <section className="container is-flex is-justify-content-center">
    <form @:submit.prevent="handleSubmit" className="box mt-5">
      <h1 className="title is-3">{{ formText }}</h1>

      <div className="field">
        <label className="label" htmlFor="user-email"> Email </label>

        <div className="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            className="input"
            placeholder="Enter your email"
            v-model="this.email"
            required
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
        </div>

        <p className="help is-danger">error message</p>
      </div>

      <NeedToRegister v-model="userName" v-if="this.userDoesNotExist" />

      <div className="field">
        <button type="submit" className="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>
