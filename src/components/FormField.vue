<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
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
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    default: '',
  },
  minlength: {
    type: Number,
    default: null,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field">
    <label class="label" :for="id">
      {{ label }}
    </label>

    <div class="control has-icons-left" :class="{ 'has-icons-right': error }">
      <input
        :id="id"
        :name="name"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :minlength="minlength"
        class="input"
        :class="{ 'is-danger': error }"
        required
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <span class="icon is-small is-left">
        <i :class="icon"></i>
      </span>

      <span v-if="error" class="icon is-small is-right has-text-danger">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger">
      {{ error }}
    </p>
  </div>
</template>
