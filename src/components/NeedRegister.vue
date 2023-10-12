<script>
export default {
  name: 'NeedRegister',
}
</script>

<template>
  <div className="field">
    <label className="label" htmlFor="user-name">Your Name</label>

    <div className="control has-icons-left">
      <input
        type="text"
        id="user-name"
        name="name"
        className="input"
        placeholder="Enter your name"
        required
        minlength="{4}"
      />

      <span className="icon is-small is-left">
        <i className="fas fa-user"></i>
      </span>
    </div>
  </div>
</template>