<script>
export default {
  name: "NeedToRegister",
  props: {
    modelValue: String,
    clearErrorByField: Function,
    name: String,
    error: String,
  },
  emits: ["update:modelValue"],
  methods: {
    handleInputChange(event) {
      this.$emit("update:modelValue", event.target.value);
      this.clearErrorByField(this.name);
    },
  },
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
        :minlength="4"
        @change.prevent="handleInputChange"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>
    </div>

    <p v-if="error.length" class="help is-danger">{{ this.error }}</p>
  </div>
</template>
