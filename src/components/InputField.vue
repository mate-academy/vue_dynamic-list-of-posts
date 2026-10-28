<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  hasError: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
    <div class="field" data-cy="NameField">
  <label class="label" :for="`comment-author-name-${name}`">
    {{ title }}
  </label>
  <div class="control has-icons-left has-icons-right">
    <input
      :type="type"
      :name="name"
      :id="`comment-author-name-${name}`"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input"
      :class="{ 'is-danger': hasError }"
    />
    <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>
  
    <span
      v-if="hasError"
      class="icon is-small is-right has-text-danger"
      data-cy="ErrorIcon"
    >
      <i class="fas fa-exclamation-triangle"></i>
    </span>
  </div>

  <p v-if="hasError" class="help is-danger" data-cy="ErrorMessage">
    {{ errorMessage }}
  </p>
</div>
</template>

<style scoped></style>