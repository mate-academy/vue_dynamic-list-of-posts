<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
const { userName, title, inputName, error, placeholder, modelValue, type } =
  defineProps([
    "userName",
    "title",
    "inputName",
    "error",
    "placeholder",
    "modelValue",
    "type",
  ]);

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(modelValue);

watch(
  () => modelValue,
  (newValue) => {
    internalValue.value = newValue;
  }
);

watch(internalValue, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" htmlFor="`comment-author-name-${userName}`">
      {{ title }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :type="type"
        :name="inputName"
        :id="`comment-author-name-${userName}`"
        :placeholder="placeholder"
        :class="{ 'is-danger': error?.length}"
        v-model="internalValue"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span 
        v-if="error?.length > 0" 
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger">{{ error }}</p>
  </div>
</template>
