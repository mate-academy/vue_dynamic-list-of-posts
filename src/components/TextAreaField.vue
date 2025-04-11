<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :htmlFor="`comment-${name}`"> {{ name }} </label>
    <div class="control">
      <textarea
        :id="`comment-${name}`"
        :name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': textError }"
        :value="modelValue"
        @input="handleTextArea($event)"
      ></textarea>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">{{ textError }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TextAreaField',
  props: {
    name: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    textError: {
      type: String,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    handleTextArea(event: Event) {
      const target = event.target as HTMLTextAreaElement

      this.$emit('update:modelValue', target.value)
    },
  },
}
</script>
