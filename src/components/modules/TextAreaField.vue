<script setup>
import { defineProps, defineEmits } from 'vue';
defineProps({
  label: String,
  inputId: String,
  placeholder: String,
  errorMessage: String,
  modelValue: [String, Number],
});

const emit = defineEmits(['update:modelValue']);

const updateValue = event => {
  emit('update:modelValue', event.target.value);
};
</script>
<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :for="inputId"> {{ label }} </label>
    <div class="control">
      <textarea
        :id="inputId"
        :name="inputId"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': errorMessage }"
        :value="modelValue"
        @input="updateValue"
      ></textarea>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
