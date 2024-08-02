<script>
import { createUser, findUser } from "@/api/users";
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
      userName: "",

      errors: {
        email: "",
        userName: "",
      },

      userFound: null,
      userDoesNotExist: false,

      isSendingRequest: false,
    };
  },

  computed: {
    formText() {
      return this.userDoesNotExist === true
        ? "You need to register"
        : "Get your userId";
    },
  },

  watch: {
    isSendingRequest() {
      console.log("isSendingRequest:", this.isSendingRequest);
    },
  },

  methods: {
    validateData() {
      if (!this.email.length) {
        this.errors.email = "No email provided";
        return false;
      }
      if (!this.validateEmail(this.email)) {
        this.errors.email = "Invalid email";
        return false;
      }
      if (this.userDoesNotExist && this.userName.length < 4) {
        this.errors.userName = "Name has to be at least 4 characters long";
        return false;
      }
      return true;
    },
    async handleSubmit() {
      this.showLoader();

      if (!this.validateData()) {
        this.hideLoader();
        return;
      }

      if (this.userDoesNotExist && this.userName?.length > 0) {
        await this.logInOrCreateAccount();
        return;
      }

      findUser(this.email.toLowerCase())
        .then((user) => {
          if (user === null) {
            this.userDoesNotExist = true;
          } else {
            this.userFound = user;
            this.logInOrCreateAccount();
          }
        })
        .catch(() => console.log("Could not find the user"))
        .finally(() => {
          this.hideLoader();
        });
    },

    showLoader() {
      this.isSendingRequest = true;
    },
    hideLoader() {
      this.isSendingRequest = false;
    },

    async logInOrCreateAccount() {
      if (this.userFound === null) {
        this.createNewUser();
      } else {
        // Log the user in
        this.$emit("update:modelValue", this.userFound);
      }
    },

    createNewUser() {
      this.showLoader();

      createUser(this.userName, this.email.toLowerCase())
        .then((response) => this.$emit("update:modelValue", response.data))
        .catch((error) => console.log("Could not create the account:", error))
        .finally(() => {
          this.hideLoader();
        });
    },
    validateEmail(email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },
    clearErrorByField(field) {
      if (field in this.errors) {
        this.errors[field] = "";
      }
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
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            v-model="this.email"
            @change="clearErrorByField('email')"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p v-if="this.errors.email.length" class="help is-danger">
          {{ this.errors.email }}
        </p>
      </div>

      <NeedToRegister
        v-model="userName"
        v-if="this.userDoesNotExist"
        :clearErrorByField="clearErrorByField"
        :error="this.errors.userName"
        name="userName"
      />

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
          :class="this.isSendingRequest ? 'is-loading' : ''"
        >
          {{ this.userDoesNotExist ? "Register" : "Login" }}
        </button>
      </div>
    </form>
  </section>
</template>
