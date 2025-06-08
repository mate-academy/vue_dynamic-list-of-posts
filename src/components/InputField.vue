<script>
export default {
  name: 'InputField',
  props: {
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    errorText: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'removeErr'],
};
</script>

<template>
  <div class="field" data-cy="NameField">
    <label
      class="label input-field__label"
      :for="`comment-author-name-${name}`"
    >
      {{ title }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :id="`comment-author-name-${name}`"
        type="text"
        :name="name"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': hasError }"
        :value="modelValue"
        @input="
          $emit('update:modelValue', $event.target.value);
          $emit('removeErr');
        "
      />
      <span class="icon is-small is-left">
        <i
          class="fas"
          :class="{
            'fa-user': !name.toLowerCase().includes('email'),
            'fa-envelope': name.toLowerCase().includes('email'),
          }"
        ></i>
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

<style>
.input-field__label {
  text-transform: capitalize;
}
</style>
