<script>
export default {
  name: 'TextAreaField',
  props: {
    name: {
      type: String,
      default: '', // Default to an empty string
    },
    placeholder: {
      type: String,
      default: '', // Default to an empty string
    },
    errorText: {
      type: String,
      default: '', // Default to an empty string
    },
    hasError: {
      type: Boolean,
      default: false, // Default to false
    },
    title: {
      type: String,
      default: '', // Default to an empty string
    },
    // ... modelValue is handled separately below
  },
  emits: ['update:modelValue', 'removeErr'],
};
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label textarea-field__label" :for="`comment-${name}`">
      {{ title }}
    </label>
    <div class="control">
      <textarea
        :id="`comment-${name}`"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        :class="{ 'is-danger': hasError }"
        class="textarea"
        autocomplete="off"
        @input="
          $emit('update:modelValue', $event.target.value);
          $emit('removeErr');
        "
      ></textarea>
    </div>

    <p v-if="hasError" class="help is-danger" data-cy="ErrorMessage">
      {{ errorText }}
    </p>
  </div>
</template>

<style>
.textarea-field__label {
  text-transform: capitalize;
}
</style>
