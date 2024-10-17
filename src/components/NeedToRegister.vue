<script>
export default {
  name: "NeedToRegister",
  props: {
    modelValue: String,
    errMessage: String,
  },
  emits: ["update:modelValue", 'onInput'],
  data() {
    return {
    };
  },
  methods: {
    onInput(e) {
      this.$emit("update:modelValue", e.target.value);
      this.$emit("onInput", '');
    },
  },
};
</script>

<template>
  <div className="field">
    <label className="label" htmlFor="user-name"> Your Name </label>

    <div className="control has-icons-left">
      <input
        :value="modelValue"
        @input="onInput"
        type="text"
        id="user-name"
        name="name"
        className="input"
        placeholder="Enter your name"
        required
        minlength="{4}"
      />

      <span className="icon is-small is-left">
        <i className="fas fa-user"> </i>
      </span>
    </div>

    <p className="help is-danger">{{ errMessage }}</p>
  </div>
</template>
