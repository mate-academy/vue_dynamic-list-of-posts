<script setup>
import { ErrorMessages } from '@/utils/ErrorMessages.js'

defineProps({
  title: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const error = defineModel('error', {
  type: String,
})

const model = defineModel({ type: String })
</script>
<template>
  <div class="field" data-cy="BodyField">
    <label class="label" htmlFor="textarea">{{ title }}</label>
    <div class="control">
      <textarea
        v-model="model"
        id="textarea"
        :name="title"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': error }"
        @input="error = ErrorMessages.None"
      ></textarea>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>
