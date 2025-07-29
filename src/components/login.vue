<script setup>
function handleSubmit() {
  // Handle form submission logic here
  console.log("Form submitted");
}
</script>

<template>
  <section className="container is-flex is-justify-content-center">
    <form @submit.prevent="handleSubmit" className="box mt-5">
      <h1 className="title is-3">You need to register"</h1>

      <div className="field">
        <label className="label" htmlFor="user-email"> Email </label>

        <div className="control has-icons-left">
          <input
            type="email"
            id="user-email"
            name="email"
            className="input"
            placeholder="Enter your email"
            required
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope"></i>
          </span>
        </div>

        <p className="help is-danger">error message</p>
      </div>

      <div className="field">
        <button type="submit" className="button is-primary">Login</button>
      </div>
    </form>
  </section>
</template>
