<script setup>
const props = defineProps({
  title: String,
  name: String,
  errorMessage: String,
  placeholder: String,
});

const model = defineModel();
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :htmlFor="`comment-${name}`"> {{ title }} </label>
    <div class="control">
      <textarea
        v-model="model"
        :id="`comment-${name}`"
        :name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': errorMessage }"
      ></textarea>
    </div>

    <p v-if="errorMessage" class="help is-danger" data-cy="ErrorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
