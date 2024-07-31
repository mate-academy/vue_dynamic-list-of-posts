<script>
export default {
  name: "NeedToRegister",
  props: {
    modelValue: String,
  },
  emits: ["update:modelValue"],
};
</script>

<template>
  <div className="field">
    <label className="label" htmlFor="user-name"> Your Name </label>

    <div className="control has-icons-left">
      <input
        type="text"
        id="user-name"
        name="name"
        className="input"
        placeholder="Enter your name"
        required
        :minlength="4"
        @change.prevent="
          (event) => {
            $emit('update:modelValue', event.target.value);
          }
        "
      />

      <span className="icon is-small is-left">
        <i className="fas fa-user" />
      </span>
    </div>

    <p className="help is-danger">error message</p>
  </div>
</template>
