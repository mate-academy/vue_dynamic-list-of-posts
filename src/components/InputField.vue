<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  name: { type: String, required: true },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  icon: { type: String, default: 'fa-user' },
  type: { type: String, default: 'text' },
  dataCy: { type: String, default: 'InputField' },
});

defineEmits(['update:modelValue']);

const id = `field-${props.name}-${Math.random().toString(36).slice(2, 8)}`;
</script>

<template>
  <div class="field" :data-cy="dataCy">
    <label class="label" :for="id">{{ label }}</label>

    <div class="control has-icons-left" :class="{ 'has-icons-right': error }">
      <input
        :id="id"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        class="input"
        :class="{ 'is-danger': error }"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <span class="icon is-small is-left">
        <i class="fas" :class="icon"></i>
      </span>

      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>
