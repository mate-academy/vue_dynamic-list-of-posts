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
  <div class="field">
    <label class="label" htmlFor="user-name"> Your Name </label>

    <div class="control has-icons-left">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        required
        :minlength="4"
        @change.prevent="
          (event) => {
            $emit('update:modelValue', event.target.value);
          }
        "
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>
    </div>

    <p class="help is-danger">error message</p>
  </div>
</template>
