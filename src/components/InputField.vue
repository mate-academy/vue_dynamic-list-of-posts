<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  icon: String,
  error: String,
});

const model = defineModel();
</script>

<template>
  <div class="field">
    <label class="label" :for="`${label}`">
      {{ label }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        v-model="model"
        type="text"
        :name="label"
        :id="label"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': !!error }"
      />

      <span v-if="icon"  class="icon is-small is-left">
        <i :class="`fas fa-${icon}`"></i>
      </span>
      
      <span v-if="error"
        class="icon is-small is-right has-text-danger"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger">{{ error }}</p>
  </div>
</template>
