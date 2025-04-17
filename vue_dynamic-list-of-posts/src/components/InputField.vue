<!-- filepath: c:\git-repos\course\vue\vue_dynamic-list-of-posts___\src\components\InputField.vue -->
<template>
  <div class="field" :data-cy="dataCy">
    <label class="label" :for="`comment-author-name-${name}`">
      {{ title }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        :name="name"
        :id="`comment-author-name-${name}`"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': hasError }"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
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
      {{ errorText }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'InputField',
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
      default: 'NameField',
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