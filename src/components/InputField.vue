<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'fa-user',
  },
  dataCy: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

function onInput(event) {
  emit('update:modelValue', event.target.value);
  emit('change');
}
</script>

<template>
  <div class="field" :data-cy="dataCy || undefined">
    <label class="label" :for="name">{{ label }}</label>

    <div class="control has-icons-left" :class="{ 'has-icons-right': error }">
      <input
        :id="name"
        :name="name"
        :type="type"
        class="input"
        :class="{ 'is-danger': error }"
        :placeholder="placeholder"
        :value="modelValue"
        :autocomplete="autocomplete"
        @input="onInput"
      />

      <span class="icon is-small is-left" aria-hidden="true">
        <i class="fas" :class="icon"></i>
      </span>

      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
        aria-hidden="true"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>
