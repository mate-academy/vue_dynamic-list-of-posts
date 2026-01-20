<template>
  <section class="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" class="box mt-5">
      <h1 class="title is-3">You need to login</h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>

        <div class="control has-icons-left">
          <input
            type="email"
            id="user-email"
            v-model="email"
            class="input"
            placeholder="Enter your email"
            required
          />

          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        </div>

        <p v-if="error" class="help is-danger">{{ error }}</p>
      </div>

      <div class="field">
        <button type="submit" class="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      error: ''
    }
  },
  emits: ['login'],
  methods: {
    handleSubmit() {
      this.error = '';
      this.$emit('login', this.email);
    }
  }
}
</script>
