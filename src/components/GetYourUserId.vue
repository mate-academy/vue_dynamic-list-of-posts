<script>
import { getUsers } from "../api/usersData";

export default {
  name: "GetYourUserId",
  data() {
    return {
      email: this.$route.query.email || "",
      name: this.$route.query.name || "",
      isLoading: false,
      error: "",
      loaderStyle: { right: "0", top: "50%" },
      registeredUsers: [],
    };
  },

  mounted() {
    this.registeredUsers = getUsers();

    if (this.registeredUsers.length > 0) {
      const foundUser = this.registeredUsers.find(
        (user) => user.email === this.email
      );
      if (foundUser) {
        this.email = foundUser.email;
      }
    }
  },

  methods: {
    checkUserRegistration() {
      this.registeredUsers = getUsers();

      const user = this.registeredUsers.find(
        (user) => user.email === this.email
      );
      return user;
    },

    handleSubmit() {
      if (!this.email) {
        this.error = "Email cannot be empty.";
        return;
      }

      if (!this.email.includes("@") || !this.email.includes(".")) {
        this.error = "Invalid email address. Please enter a valid email.";
        return;
      }

      this.error = "";
      this.isLoading = true;

      setTimeout(() => {
        const registeredUser = this.checkUserRegistration();
        if (registeredUser) {
          this.$root.showGlobalLoader();
          setTimeout(() => {
            this.$router.push({
              path: "/header",
              query: { email: registeredUser.email, name: registeredUser.name },
            });
            this.isLoading = false;
            this.$root.hideGlobalLoader();
          }, 300);
        } else {
          this.$root.showGlobalLoader();
          setTimeout(() => {
            this.$router.push({
              path: "/needToRegister",
              query: { email: this.email },
            });
            this.isLoading = false;
            this.$root.hideGlobalLoader();
          }, 300);
        }
      }, 500);
    },
  },
};
</script>

<template>
  <div class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5" novalidate>
      <h1 class="title is-3">Get your userId</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control has-icons-left">
          <div class="input-container">
            <input
              v-model="email"
              type="email"
              id="user-email"
              name="email"
              class="input"
              placeholder="Enter your email"
              required
              :disabled="isLoading"
            />
            <div v-if="isLoading" class="loader-container">
              <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p v-if="error" class="help is-danger">{{ error }}</p>
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary login-button"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="button-content">
            <div class="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </span>
          <span v-else class="button-content">Login</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.help.is-danger {
  margin-top: 10px;
}

.input {
  transition: background-color 0.3s ease;
}

.input:focus {
  outline: none;
  border: 1px solid rgba(70, 90, 126, 0.6);
  box-shadow: 0 0 5px rgba(70, 90, 126, 0.4);
}

.input:-webkit-autofill {
  background-color: rgba(4, 17, 39, 0.4) !important;
  color: white !important;
  box-shadow: 0 0 0px 1000px rgba(6, 27, 67, 0.4) inset !important;
  outline: none;
}

.control {
  position: relative;
}

.input-container {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
}

.input {
  padding-right: 40px !important;
}
.loader-container {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 2px;
  border: 3px solid #c0c0c0;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #c0c0c0 transparent transparent transparent;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.login-button {
  position: relative;
  min-width: 73px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
