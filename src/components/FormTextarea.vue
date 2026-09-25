<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
})

const model = defineModel()
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :for="`post-${name}`">
      {{ title }}
    </label>

    <div class="control">
      <textarea
        v-model="model"
        :id="`post-${name}`"
        :name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': error }"
      ></textarea>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>
