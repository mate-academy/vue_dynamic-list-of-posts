<script setup>
defineProps({
  modelValue: String,
  title: String,
  name: String,
  placeholder: String,
  errorText: String,
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :for="`comment-${name}`">{{ title }}</label>
    <div class="control">
      <textarea
        :id="`comment-${name}`"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': errorText }"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
    <p v-if="errorText" class="help is-danger" data-cy="ErrorMessage">{{ errorText }}</p>
  </div>
</template>