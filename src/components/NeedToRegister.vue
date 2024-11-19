<script setup>

const props = defineProps({
  modelValue: String,
  error: String,
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
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
        :value="modelValue"
        @input="handleInput"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>
    </div>

    <p v-if="error" class="help is-danger">{{ error }}</p>
  </div>

</template>
