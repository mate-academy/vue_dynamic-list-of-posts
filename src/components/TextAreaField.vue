<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  dataCy: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

function onInput(event) {
  emit('update:modelValue', event.target.value);
  emit('change');
}
</script>

<template>
  <div class="field" :data-cy="dataCy || undefined">
    <label class="label" :for="name">{{ label }}</label>

    <div class="control">
      <textarea
        :id="name"
        :name="name"
        class="textarea"
        :class="{ 'is-danger': error }"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
      ></textarea>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>
