<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
const { userName, title, inputName, error, placeholder, modelValue, type } = defineProps({
  userName: String,
  title: String,
  inputName: String,
  error: String,
  placeholder: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text',
  },
})
const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(modelValue);

watch(() => modelValue, (newVal) => {
  internalValue.value = newVal
})

watch(internalValue, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :for="`comment-author-name-${userName}`">
      {{title}}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :type="type"
        :name="inputName"
        :id="`comment-author-name-${userName}`"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger' :error?.length}"
        v-model="internalValue"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span
        v-if="error?.length"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error?.length" class="help is-danger" data-cy="ErrorMessage">{{error}}</p>
  </div>
</template>
