<script setup>
import { defineProps, watch, ref } from 'vue';
const {userName, title, error, placeholder,modelValue} = defineProps([
  'userName',
  'title',
  'error',
  'placeholder',
  'modelValue'
]);

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(modelValue);

watch(() => modelValue, (newValue) => {
  internalValue.value = newValue;
});

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
});

</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :htmlFor="`comment-${name}`"> {{ title }} </label>
    <div class="control">
      <textarea
        :id="`comment-${userName}`"
        :name="userName"
        :placeholder="placeholder"
        :class="['textarea', { 'is-danger': error?.length }]"
        v-model="internalValue"
      ></textarea>
    </div>

    <p v-if="error?.length" class="help is-danger">{{ error }}</p>
  </div>
</template>
