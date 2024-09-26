<script setup>
import { ref, onMounted } from 'vue'

const { name } = defineProps({
  name: String,
  error: String
})

const model = defineModel()

const textAreaLabel = ref('')
const textAreaPlaceholder = ref('')

onMounted(() => {
  switch (name) {
    case 'comment':
      textAreaLabel.value = 'Write Comment'
      textAreaPlaceholder.value = 'Comment'
      break
    case 'body':
      textAreaLabel.value = 'Write Post Body'
      textAreaPlaceholder.value = 'Post Body'
  }
})
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :htmlFor="name"> {{ textAreaLabel }} </label>
    <div class="control">
      <textarea
        :id="name"
        :name="name"
        :placeholder="textAreaPlaceholder"
        class="textarea"
        :class="{ 'is-danger': error }"
        v-model.trim="model"
      ></textarea>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">{{ error }}</p>
  </div>
</template>
