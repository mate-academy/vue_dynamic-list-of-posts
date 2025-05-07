<template>
  <section className="container is-flex is-justify-content-center">
    <form className="box mt-5">
      <h1 className="title is-3">You need to register</h1>

      <div className="field">
        <label className="label" htmlFor="user-email"> Email </label>

        <div className="control has-icons-left">
          <input
            v-model="email"
            type="email"
            id="user-email"
            name="email"
            className="input"
            placeholder="Enter your email"
            required
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
        </div>

        <p v-if="this.email.length === 0" className="help is-danger">
          error message
        </p>
      </div>

      <div className="field">
        <button
          type="submit"
          className="button is-primary"
          @click.prevent="appLoginByEmail"
        >
          Login
        </button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      email: "asd@sad",
    };
  },

  methods: {
    appLoginByEmail() {
      if (this.email.length === 0) {
        return;
      }
      this.$emit("handleGetUser", this.email);
    },
  },
};
</script>
