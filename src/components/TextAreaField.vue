<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  name: { type: String, required: true },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  dataCy: { type: String, default: 'TextAreaField' },
});

defineEmits(['update:modelValue']);

const id = `field-${props.name}-${Math.random().toString(36).slice(2, 8)}`;
</script>

<template>
  <div class="field" :data-cy="dataCy">
    <label class="label" :for="id">{{ label }}</label>

    <div class="control">
      <textarea
        :id="id"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        class="textarea"
        :class="{ 'is-danger': error }"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>
