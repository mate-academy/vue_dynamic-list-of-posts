<script>
export default {
  name: 'InputField',
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
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    icon: {
      type: String,
      default: 'user',
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
};
</script>

<template>
  <div class="field" :data-cy="`${name}Field`">
    <label class="label" :for="name">{{ label }}</label>
    <div class="control has-icons-left has-icons-right">
      <input
        :id="name"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': error }"
        :value="modelValue"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${name}-error` : undefined"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span class="icon is-small is-left" aria-hidden="true">
        <i :class="`fas fa-${icon}`"></i>
      </span>
      <span v-if="error" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon" aria-hidden="true">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>
    <p v-if="error" :id="`${name}-error`" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>
