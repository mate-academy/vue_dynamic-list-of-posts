<script setup lang="ts">
import { ref, watch } from "vue";
import { User } from "../../types/user";

const props = defineProps<{
  user: User;
  handleClickLogout: () => void;
}>();

const localUser = ref<User>(props.user);

watch(
  () => props.user,
  (newUser) => {
    localUser.value = newUser!;
  }
);

console.log(localUser.value);
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4 title">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ localUser?.name }}</p>
          </div>
          <a class="button is-light" @click="handleClickLogout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
