<script setup>
  import { ERROR_MESSAGES } from '@/utils/errorMessages';

  defineProps({
    title: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    type: {
      default: 'text',
      type: String,
    },
  });

  const error = defineModel('error', { type: String });
  const model = defineModel({ type: String });
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :for="title">{{ title }}</label>

    <div class="control has-icons-left has-icons-right">
      <input
        :id="title"
        v-model="model"
        :type="type"
        :class="{ 'is-danger': !!error }"
        class="input"
        :name="title"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="error = ERROR_MESSAGES.NONE"
      />

      <span v-if="icon" class="icon is-small is-left">
        <i class="fas" :class="icon"></i>
      </span>

      <span v-if="!!error" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="!!error" class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>
