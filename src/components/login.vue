<template>
    <div class="user" v-if="emailData === ''">
        <h1 class="user__title">Get your userId</h1>

        <h3 class="user__label">Email</h3>

        <input 
            type="email"
            required
            class="user__input"
            placeholder="E-mail"
            v-model="emailInput"
        >

        <button 
            class="user__button"
            @click="addEmail"
        >
            Login
        </button>
    </div>

    <div class="user user__partName" v-else>
        <h1 class="user__title title__partName">You need to register</h1>

        <h3 class="user__label label__partName">Email</h3>

        <input 
            type="email" 
            class="user__input"
            :placeholder="emailData"
            disabled
        >

        <h3 class="user__label label__partName label2__partName">Your Name</h3>

        <input 
            type="email" 
            class="user__input input__partName"
            placeholder="Enter your name"
            v-model="nameUser"
        >

        <button 
            class="user__button button__partName"
            @click="registerUser"
        >
            Register
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import StorageService from '@/utils/storage';
import { useRouter } from 'vue-router';

const emailInput = ref('');
const emailData = ref('');
const nameUser = ref('');

const router = useRouter();

function addEmail() {
  const email = emailInput.value.trim();

  if (email === '') return;

  const hasAt = email.includes('@');
  const hasDotAfterAt = email.indexOf('.') > email.indexOf('@') + 1;

  if (!hasAt || !hasDotAfterAt) {
    alert('This email address is invalid.');
    return;
  }

  emailData.value = email;
}

function registerUser() {
  const userName = nameUser.value.trim();

  if (userName === '') {
    alert('This name is invalid.');
    return;
  }

  const userObj = {
    user: userName,
    email: emailData.value,
    posts: []
  };

  StorageService.set('userData', userObj);

  console.log('Salvo no localStorage:', userObj);

  router.push('/home');
}
</script>

<style scoped>
@font-face {
  font-family: 'Roboto';
  src: url('../assets/fonts/Roboto/Roboto-VariableFont_wdth\,wght.ttf') format('woff2');
}

* {
    font-family: 'Roboto';
}

.user {
    width: 274px;
    height: 224px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: calc(50% - 137px);
}

.user__title {
    font-size: 35px;
    color: #363636;
    margin-left: 15px;
    margin-bottom: 15px;
}

.user__label {
    margin-left: 15px;
    color: #363636;
    margin-bottom: 8px;
}

.user__input {
    background-image: url('../icons/iconEmail.png');
    background-repeat: no-repeat;
    background-position: 12px center;
    background-size: 20px;
    padding-left: 40px;
    height: 40px;
    width: 210px;
    height: 30px;
    border: 0.5px solid #cfcfcf;
    margin-left: 10px;
    font-size: 15px;
    border-radius: 5px;
}

.user__button {
    width: 65px;
    height: 30px;
    color: #ffffff;
    background-color: #00d1b2;
    border: none;
    border-radius: 5px;
    margin-left: 10px;
    margin-top: 10px;
}

.title__partName {
    font-size: 27px;
}

.label__partName {
    font-size: 14px;
    margin-top: -5px;
}

.input__partName {
    background-image: url('../icons/iconUser.png');
}

.label2__partName {
    margin-top: 7px;
    margin-bottom: 5px;
}

.button__partName {
    width: 90px;
    height: 30px;
}

.user__partName {
    height: 240px;
}

button {
    cursor: pointer;
}
</style>