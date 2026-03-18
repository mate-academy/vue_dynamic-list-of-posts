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
  <div class="field" data-cy="NameField">
    <label class="label" :for="`comment-author-name-${name}`">
      {{ title }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        :id="`comment-author-name-${name}`"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': errorText }" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span class="icon is-small is-left">
        <i class="fas" :class="name === 'email' ? 'fa-envelope' : 'fa-user'"></i>
      </span>

      <span v-if="errorText" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="errorText" class="help is-danger" data-cy="ErrorMessage">{{ errorText }}</p>
  </div>
</template>