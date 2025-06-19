<script setup>
import { ref } from 'vue';

const {userData} = defineProps(['userData']);
const emit = defineEmits(['logout']);


</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5">
            <p>User: {{ userData.name }}</p>
          </div>

          <a class="button is-light" @click="$emit('logout')"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>
