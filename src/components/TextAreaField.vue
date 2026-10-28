<script setup>
defineProps({
  title: {
    type: String,
    required: true
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
    type: String,
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
<div class="field" data-cy="BodyField">
  <label class="label" :for="`comment-${name}`">{{ title }}</label>
  <div class="control">
    <textarea
      :id="`comment-${name}`"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="textarea"
      :class="{ 'is-danger': hasError }"
    ></textarea>
  </div>

  <p v-if="hasError" class="help is-danger" data-cy="ErrorMessage">
      {{ errorMessage }}
  </p>
</div>

</template>

<style scoped></style>