<template>
  <div class="field">
    <label class="label" :for="id">{{ label }}</label>
    <div class="control">
      <textarea
        :id="id"
        :name="name"
        :placeholder="placeholder"
        :class="['textarea', { 'is-danger': error }]"
        :value="internalValue"
        @input="onInput"
      ></textarea>
    </div>
    <p v-if="error" class="help is-danger">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  name: String,
  id: String,
  placeholder: String,
  modelValue: String,
  error: String,
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const onInput = (event) => {
  internalValue.value = event.target.value
}
</script>
