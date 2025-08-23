<template>
  <div class="field" :data-cy="dataCy">
    <label class="label" :for="id">{{ label }}</label>

    <div class="control has-icons-left" :class="{ 'has-icons-right': error }">
      <input
        :type="type"
        :id="id"
        :name="name"
        :placeholder="placeholder"
        :value="internalValue"
        @input="onInput"
        :class="['input', { 'is-danger': error }]"
      />
      <span class="icon is-small is-left">
        <i :class="leftIcon" />
      </span>
      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  name: String,
  id: String,
  label: String,
  placeholder: String,
  error: String,
  type: {
    type: String,
    default: 'text',
  },
  leftIcon: {
    type: String,
    default: 'fas fa-user',
  },
  dataCy: {
    type: String,
    default: 'InputField',
  },
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

