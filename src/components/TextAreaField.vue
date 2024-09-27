<script setup>
import { computed } from 'vue'

const { name } = defineProps({
  name: String,
  error: String
})

const model = defineModel()

const textArea = computed(() => {
  switch (name) {
    case 'comment':
      return { label: 'Write Comment', placeholder: 'Comment' }

    case 'body':
      return { label: 'Write Post Body', placeholder: 'Post Body' }

    default:
      return { label: '', placeholder: '' }
  }
})
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :htmlFor="name"> {{ textArea.label }} </label>
    <div class="control">
      <textarea
        :id="name"
        :name="name"
        :placeholder="textArea.placeholder"
        class="textarea"
        :class="{ 'is-danger': error }"
        v-model.trim="model"
      ></textarea>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>
