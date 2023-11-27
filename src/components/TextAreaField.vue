<script setup>
  const props = defineProps({
      textareaTitle: String,
      textareaName: String,
      placeholder: String,
      modelValue: String,
      incorrectBody: Boolean,
    });
</script>
<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :htmlFor="`comment-${textareaName}`"> {{ textareaTitle }} </label>
    <div class="control">
      <textarea
        :id="`comment-${textareaName}`"
        :name="textareaName"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': incorrectBody }"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>

    <p v-if="incorrectBody" class="help is-danger" data-cy="ErrorMessage">error text</p>
  </div>
</template>