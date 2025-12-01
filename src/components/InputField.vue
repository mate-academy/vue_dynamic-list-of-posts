<script setup>
import { ErrorMessages } from '@/utils/ErrorMessages'
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  type: {
    default: 'text',
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const error = defineModel('error', {
  type: String,
})

const emit = defineEmits(['update:modelValue'])

const onInput = (event) => {
  emit('update:modelValue', event.target.value)

  if (error.value) {
    error.value = ErrorMessages.None
  }
}
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :for="name">{{ title }}</label>

    <div class="control has-icons-left has-icons-right">
      <input
        :id="name"
        class="input"
        :class="{ 'is-danger': !!error }"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        :type="type"
        :disabled="disabled"
        @input="onInput"
      />

      <span v-if="icon" class="icon is-small is-left">
        <i class="fas" :class="icon"></i>
      </span>

      <span v-if="error" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>

<style></style>
