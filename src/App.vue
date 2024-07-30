<script>
import TheWelcome from "./components/TheWelcome.vue";

export default {
  data() {
    return {
      email: String,
      userId: Boolean,
    };
  },
};
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <!-- <HelloWorld msg="You did it!" /> -->
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>
