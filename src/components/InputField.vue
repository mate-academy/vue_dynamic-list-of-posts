<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: String,
  inputName: {
    type: String,
    required: true,
  },
  inputError: String,
});

const emit = defineEmits(['update:modelValue', 'removeError']);

const fieldConfig = {
  postTitle: {
    label: 'Title',
    type: 'text',
    placeholder: 'Post title',
    icon: 'fa-user',
  },
  commentAuthor: {
    label: 'Author Name',
    type: 'text',
    placeholder: 'Name Surname',
    icon: 'fa-user',
  },
  commentAuthorEmail: {
    label: 'Author Email',
    type: 'email',
    placeholder: 'Your Email',
    icon: 'fa-envelope',
  },
};

const config = ref({});

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value),
});

onMounted(() => {
  config.value = fieldConfig[props.inputName] || {};
});
</script>

<template>
  <div class="field">
    <label class="label" :for="inputName">{{ config.label }}</label>

    <div class="control has-icons-left has-icons-right">
      <input
        :id="inputName"
        :name="inputName"
        :type="config.type"
        :placeholder="config.placeholder"
        class="input"
        :class="{ 'is-danger': inputError }"
        v-model="inputValue"
        @input="emit('removeError')"
      />

      <span class="icon is-small is-left">
        <i class="fas" :class="config.icon"></i>
      </span>

      <span class="icon is-small is-right has-text-danger" v-if="inputError">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger" v-if="inputError">{{ inputError }}</p>
  </div>
</template>

<style></style>
