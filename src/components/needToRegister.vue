<script setup>
defineProps(["modelValue", "errorMessage"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="field">
    <label class="label" htmlFor="user-name"> Your Name </label>

    <div class="control has-icons-left">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        required
        minlength="4"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
    </div>

    <p class="help is-danger">{{ errorMessage }}</p>
  </div>
</template>
