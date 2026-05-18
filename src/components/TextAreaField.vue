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
  placeholder: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    default: '',
  },
  dataCy: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field" :data-cy="dataCy">
    <label class="label" :for="id">{{ label }}</label>

    <div class="control">
      <textarea
        :id="id"
        :value="modelValue"
        :name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': error }"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>
