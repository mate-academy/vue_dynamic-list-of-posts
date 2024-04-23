<script>
  export default {
    name: 'TextAreaField',
    props: {
      title: String,
      inputName: String,
      errorMessage: String,
      placeholder: String,
      modelValue: String,
    },
    emits: ['update:modelValue'],
  }
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :htmlFor="`comment-${inputName}`">{{ title }}</label>
    <div class="control">
      <textarea
        :id="`comment-${inputName}`"
        :name="inputName"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': errorMessage }"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>

    <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>