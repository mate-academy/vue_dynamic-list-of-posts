<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: String,
  textAreaName: {
    type: String,
    required: true,
  },
  textAreaError: String,
});

const emit = defineEmits(['update:modelValue', 'removeError']);

const fieldConfig = {
  postBody: {
    label: 'Write Post Body',
    placeholder: 'Post body',
  },
  commentBody: {
    label: 'Write Comment',
    placeholder: 'Comment',
  },
};

const config = ref({});

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value),
});

onMounted(() => {
  config.value = fieldConfig[props.textAreaName] || {};
});
</script>

<template>
  <div class="field">
    <label class="label" :for="textAreaName">{{ config.label }}</label>

    <div class="control">
      <textarea
        :id="textAreaName"
        :name="textAreaName"
        :placeholder="config.placeholder"
        class="textarea"
        :class="{ 'is-danger': textAreaError }"
        v-model="inputValue"
        @input="emit('removeError')"
      />
    </div>

    <p class="help is-danger" v-if="textAreaError">{{ textAreaError }}</p>
  </div>
</template>

<style></style>
