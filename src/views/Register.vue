<script lang="ts">
import * as userApi from '../api/user';
import '@fortawesome/fontawesome-free/css/all.min.css'

export default {
  name: 'NeedToRegister',

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      localEmail: this.email,
      name: '',
      errorMessage: '',
    };
  },


  methods: {
    handleSubmit() {
      if (this.name.length < 4) {
        this.errorMessage = 'Name must be at least 4 characters long';
        return;
      }

      userApi.createUser(this.name, this.email)
        .then((newUser) => {

          localStorage.setItem('userId', newUser.id.toString());

          this.$router.push({
            name: 'main-page',
            params: {
              id: newUser.id,
            },
          });
        })
        .catch((err) => {
          this.errorMessage = err.message || 'Failed to create user';
        });
    }
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="field">
    <h2 class="label">You need to register</h2>

    <div class="control">
      <!-- Email Field (Disabled) -->
      <div class="wrapper-email">
        <label for="user-email" class="wrapper-name-label">Email</label>
        <div class="input_field">
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
          <input type="email" id="user-email" name="email" class="input input--disabled" placeholder="Enter your email"
            v-model="localEmail" disabled />
        </div>
      </div>

      <!-- Name Field -->
      <div class="wrapper-name">
        <label for="user-name" class="wrapper-name-label">Your name</label>
        <div class="input_field">
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>

          <input type="text" id="user-name" class="input" placeholder="Enter your name" v-model="name" minlength="4"
            required />
        </div>
      </div>
    </div>

    <button type="submit" class="button is-primary">
      <span>Register</span>
    </button>

    <template v-if="errorMessage.length !== 0">
      <p class="help is-danger">{{ errorMessage }}</p>
    </template>
  </form>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;

  margin: 0 auto;
  max-width: 300px;
  width: 100%;

  background-color: #fff;
  padding: 32px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  color: rgb(54, 54, 54);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.control {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wrapper-email,
.wrapper-name {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin: 0;
}

.wrapper-name-label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 4px;
}

.input_field {
  position: relative;
  width: 100%;
}

.input_field .icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #cbd5e0;
  font-size: 16px;
  transition: color 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.input:focus+.icon,
.input_field:focus-within .icon {
  color: rgb(74, 74, 74);
}

.input--disabled+.icon,
.input:disabled~.icon {
  color: rgb(74, 74, 74);
}

.input {
  width: 100%;
  padding: 12px 14px 12px 44px;
  font-size: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  background-color: #fff;
  color: #2d3748;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.input::placeholder {
  color: #a0aec0;
}

.input:hover:not(:disabled) {
  border-color: #cbd5e0;
}

.input:focus {
  border-color: rgb(74, 74, 74);
  box-shadow: 0 0 0 3px rgba(0, 209, 178, 0.1);
}

/* Стилі для disabled інпута */
.input:disabled,
.input--disabled {
  background-color: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
  border-color: #e2e8f0;
}

.input--disabled {
  background-color: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
  border-color: #e2e8f0;
}

.input:disabled::placeholder {
  color: #cbd5e0;
}

.button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: #00d1b2;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 209, 178, 0.2);
}

.button:hover {
  background-color: #00b89c;
  box-shadow: 0 6px 16px rgba(0, 209, 178, 0.3);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 209, 178, 0.2);
}

.help.is-danger {
  color: #e53e3e;
  font-size: 14px;
  font-weight: 500;
  margin-top: -12px;
  text-align: center;
  animation: shake 0.3s ease;
}

@media (max-width: 480px) {
  .field {
    max-width: 100%;
    padding: 24px 16px;
  }

  .label {
    font-size: 24px;
  }
}
</style>
