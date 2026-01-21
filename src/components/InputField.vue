<template>
  <div class="field" :data-cy="`${name}Field`">
    <label class="label" :for="`comment-${name}`">
      {{ label }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :type="type"
        :name="name"
        :id="`comment-${name}`"
        :placeholder="placeholder"
        :class="['input', { 'is-danger': error }]"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span class="icon is-small is-left">
        <i :class="icon"></i>
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

<script>
export default {
  name: 'InputField',
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'fas fa-user'
    },
    modelValue: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
}
</script>
