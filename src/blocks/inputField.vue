<script setup lang="ts">

const props = defineProps<{
  modelValue: string,
  title: string,
  name: string,
  placeholder?: string,
  errorMessage?: string,
  type?: 'text' | 'email' | 'password';
}>();


const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:errorMessage', value: string): void
}>();

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('update:errorMessage', '');
}


</script>
<template>
<div class="field" data-cy="Field-${name}">
  <label class="label" 
  :for="`comment-${name}`"
  >
    {{ title }}
  </label>
  <div class="control has-icons-left has-icons-right">
    <input
      type="text"
      :name="name"
      :value="modelValue"
      :id="`comment-${name}`"
      :placeholder="placeholder"
      class="input"
      @input="handleInput"
      :class="{ 'is-danger': errorMessage }"
      :aria-invalid="!!errorMessage"
      :aria-describedby="errorMessage ? `error-${name}` : undefined"

    />
    <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>

    <span
    v-if="errorMessage"
      class="icon is-small is-right has-text-danger"
      data-cy="ErrorIcon"
    >
      <i class="fas fa-exclamation-triangle"></i>
    </span>
  </div>

  <p 
  v-if="errorMessage"
  class="help is-danger" 
  data-cy="ErrorMessage">
  {{ errorMessage }}
</p>
</div>
</template>