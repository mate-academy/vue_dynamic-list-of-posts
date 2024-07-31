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
        this.createNewUser();
      } else {
        this.$emit("update:modelValue", this.userFound);
      }
    },
    createNewUser() {
      createUser(this.userName, this.email)
        .then((response) => this.$emit("update:modelValue", response.data))
        .catch((error) => console.log("Error:", error));
    },
  },
};
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form @:submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">{{ formText }}</h1>

      <div class="field">
        <label class="label" htmlFor="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            v-model="this.email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p class="help is-danger">error message</p>
      </div>

      <NeedToRegister v-model="userName" v-if="this.userDoesNotExist" />

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>
