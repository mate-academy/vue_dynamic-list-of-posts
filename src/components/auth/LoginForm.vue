<script setup lang="ts">
const handleSubmit = () => {
  console.log('submit');
};
</script>

<template>
  <section
    class="container is-flex is-justify-content-center"
  >
    <form
      class="box mt-5"
      @submit.prevent="handleSubmit"
    >
      <h1 class="title is-3">
        You need to register
      </h1>

      <div class="field">
        <label
          class="label"
          for="user-email"
        >
          Email
        </label>

        <div class="control has-icons-left">
          <input
            id="user-email"
            type="email"
            name="email"
            class="input"
            placeholder="Enter your email"
            required
          >

          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>

        <p class="help is-danger">
          error message
        </p>
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary"
        >
          Login
        </button>
      </div>
    </form>
  </section>
</template>