<template>
  <div class="field">
    <label class="label" :for="id">{{ label }}</label>
    <div class="control has-icons-left" :class="{ 'has-icons-right': error }">
      <input
        :id="id"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': error }"
        @input="$emit('update:modelValue', $event.target.value); $emit('clear-error')"
      />
      <span class="icon is-small is-left">
        <i :class="iconClass"></i>
      </span>
      <span v-if="error" class="icon is-small is-right has-text-danger">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>
    <p v-if="error" class="help is-danger">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, required: true },
  name: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  iconClass: { type: String, default: 'fas fa-user' },
  error: { type: String, default: '' },
})
defineEmits(['update:modelValue', 'clear-error'])
</script>
