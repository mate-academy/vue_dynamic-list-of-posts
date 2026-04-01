<script setup lang="ts">

const props = defineProps<{
  modelValue: string,
  title: string,
  name: string,
  placeholder?: string,
  errorMessage?: string,
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:errorMessage', value: string): void
}>();

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
  emit('update:errorMessage', '');
}

</script>
<template>

<div class="field" data-cy="BodyField">
  <label class="label" 
  :for="`comment-${name}`">
   {{ title }}
  </label>
  <div class="control">
   <textarea
        :id="`comment-${name}`"
        :name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': errorMessage }"
        :value="modelValue"
        :aria-invalid="!!errorMessage"
        :aria-describedby="errorMessage ? `error-${name}` : undefined"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value); emit('update:errorMessage', '')"
      ></textarea>
  </div>

  <p v-if="errorMessage" 
  class="help is-danger" 
  data-cy="ErrorMessage">
  {{ errorMessage }}
</p>
</div>
</template>