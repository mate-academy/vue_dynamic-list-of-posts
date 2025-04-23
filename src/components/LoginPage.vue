<script>
import { addUser, getUserByEmail } from "../api/users.js";
// import NeedToRegister from "./needToRegister.vue";
// import ChildComponent from './ChildComponent.vue';
// import { ref } from "vue";
import InputField from "./InputField.vue";
export default {
  name: "LoginPage",
  components: {
    // NeedToRegister,
    // ChildComponent,
    InputField,
  },
  data() {
    return {
      email: "",
      username: '',
      phone: '',
      name: "",
      inputError: "",
      isNeedToRegister: false,
    };
  },
  emits: ["addUser", "name"],
  methods: {
     handleData(data) {
      this.receivedData = data;
    },
    handleLogin(email) {
      getUserByEmail(email).then(({ data }) => {
        if (!data.length) {
          this.isNeedToRegister = true;
        } else {
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data[0]));
          this.$emit("addUser", data);
        }
      });
    },
    handleRegister() {
      const name = this.name;
      console.log("name", name);
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
      @submit.prevent="
        isNeedToRegister ? handleRegister() : handleLogin(email)
      "
      class="box mt-5"
    >
      <h1 class="title is-3">
        {{ isNeedToRegister ? "You need to register" : "Get your userId" }}
      </h1>

      <div class="field">
        <label class="label" for="user-email"> Email </label>

        <div class="control has-icons-left">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
            :disabled="isNeedToRegister"
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>
      </div>

      <div v-if="isNeedToRegister" class="field">

     <!--<NeedToRegister #default="{ x }" >
        {{ name = x }} 
         </NeedToRegister>
        -->
        <InputField v-model="name" :inputName="'registerName'"  :inputError="inputError"/>
        <p>my name is: {{ name }}</p>
        
  
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">
          {{ isNeedToRegister ? "Register" : "Login" }}
        </button>
      </div>
    </form>
  </section>
    <div>
   
  </div>
</template>

<script></script>
