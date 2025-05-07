<script>
import { addUser } from "../api/usersData";

export default {
  name: "NeedToRegister",
  data() {
    return {
      email: this.$route.query.email || "",
      name: this.$route.query.name || "",
      error: "",
      isLoading: false,
      loaderStyle: { right: "25px", top: "50%" },
    };
  },
  methods: {
    handleSubmit() {
      if (!this.name.trim()) {
        this.error = "Name required.";
        return;
      }

      if (this.name.length <= 3) {
        this.error = "Minimum 4 characters.";
        return;
      }

      this.error = "";
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;

        const newUser = { email: this.email, name: this.name };

        try {
          addUser(newUser);
          this.$root.showGlobalLoader();
          setTimeout(() => {
            this.$router.push({
              path: "header",
              query: { email: newUser.email, name: newUser.name },
            });

            this.$root.hideGlobalLoader();
          }, 300);
        } catch (error) {
          this.isLoading = false;
          this.error = error.message;
        }
      }, 500);
    },
  },
};
</script>

<template>
  <div class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5" novalidate>
      <h1 class="title is-3">You need to register</h1>

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
              disabled
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
            <i class="fas fa-envelope" />
          </span>
        </div>

        <label class="label mt-5" for="user-name">Your Name</label>
        <div class="control has-icons-left">
          <div class="input-container">
            <input
              v-model="name"
              type="text"
              id="user-name"
              name="name"
              class="input"
              placeholder="Enter your name"
              required
              minlength="4"
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
            <i class="fas fa-user" />
          </span>
        </div>

        <p class="help is-danger">{{ error }}</p>
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
          <span v-else class="button-content">Register</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
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
.loader-button {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
}
</style>
