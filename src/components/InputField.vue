<script>
export default {
  name: "InputField",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "user",
    },
    error: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
};
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :for="name">
      {{ label }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        :id="name"
        :name="name"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': error }"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span class="icon is-small is-left">
        <i :class="'fas fa-' + icon"></i>
      </span>

      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>
