<script>
export default {
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'], 
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value);
    },
  },
};
</script>

<template>
  <div class="field">
    <label class="label" for="user-name"> Your Name </label>

    <div class="control has-icons-left">
      <input
        type="text"
        id="user-name"
        name="name"
        :value="modelValue"
        @input="handleInput"
        class="input"
        placeholder="Enter your name"
        required
        :minlength="4"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>
    </div>
  </div>
</template>
