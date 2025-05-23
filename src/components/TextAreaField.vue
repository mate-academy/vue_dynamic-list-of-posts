<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
const { userName, title, error, placeholder, modelValue } = defineProps({
  userName: String,
  title: String,
  error: String,
  placeholder: String,
  modelValue: String
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
  <div class="field" data-cy="BodyField">
    <label class="label" :for="`comment-${userName}`"> {{title}} </label>
    <div class="control">
      <textarea
        :id="`comment-${userName}`"
        :name="userName"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': error?.length }"
        v-model="internalValue"
      ></textarea>
    </div>

    <p v-if="error?.length" class="help is-danger" data-cy="ErrorMessage">{{error}}</p>
  </div>
</template>
