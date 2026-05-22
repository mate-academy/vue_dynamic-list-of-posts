<template>
  <div class="field">
    <label class="label" :for="id">{{ label }}</label>
    <div class="control">
      <textarea
        :id="id"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': error }"
        @input="$emit('update:modelValue', $event.target.value); $emit('clear-error')"
      ></textarea>
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
  error: { type: String, default: '' },
})
defineEmits(['update:modelValue', 'clear-error'])
</script>
