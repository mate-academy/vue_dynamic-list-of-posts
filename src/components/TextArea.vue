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
  });

  const error = defineModel('error', { type: String });
  const model = defineModel({ type: String });
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :for="title">{{ title }}</label>

    <div class="control">
      <textarea
        :id="title"
        v-model="model"
        :name="title"
        :placeholder="placeholder"
        :class="{ 'is-danger': !!error }"
        class="textarea"
        @input="error = ERROR_MESSAGES.NONE"
      ></textarea>
    </div>

    <p v-if="!!error" class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>
