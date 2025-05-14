<script setup>
import { computed } from 'vue';
import ErrorMessage from './ErrorMessage.vue';

const props = defineProps({
  title: String,
  name: String,
  placeholder: String,
  errorMessage: String,
  modelValue: String,
  icon: String,
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <div class="field" :data-cy="`${name}Field`">
    <label class="label" :for="`comment-${name}`">{{ title }}</label>
    <div class="control has-icons-left has-icons-right">
      <input type="text" class="input" :id="`comment-${name}`" :name="name" :placeholder="placeholder"
        :class="{ 'is-danger': errorMessage }" v-model="value" />
      <span class="icon is-small is-left">
        <i class="fas fa-user" :class="{ [`fa-${icon}`]: icon }"></i>
      </span>
      <span class="icon is-small is-right has-text-danger" v-if="errorMessage">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>
    <ErrorMessage v-if="errorMessage">{{ errorMessage }}</ErrorMessage>
  </div>
</template>
