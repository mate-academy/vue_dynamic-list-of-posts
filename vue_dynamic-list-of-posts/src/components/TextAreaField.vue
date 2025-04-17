<!-- filepath: c:\git-repos\course\vue\vue_dynamic-list-of-posts___\src\components\TextAreaField.vue -->
<template>
  <div class="field" :data-cy="dataCy">
    <label class="label" :for="`comment-${name}`">{{ title }}</label>
    <div class="control">
      <textarea
        :id="`comment-${name}`"
        :name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': hasError }"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
      ></textarea>
    </div>

    <p v-if="hasError" class="help is-danger" data-cy="ErrorMessage">
      {{ errorText }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'TextAreaField',
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    errorText: {
      type: String,
      default: '',
    },
    dataCy: {
      type: String,
      default: 'BodyField',
    },
  },
  emits: ['update:value'],
  watch: {
    value(newValue) {
      this.$emit('update:value', newValue);
    },
  },
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>