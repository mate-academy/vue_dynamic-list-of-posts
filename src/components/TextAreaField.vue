<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    error: Boolean,
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    errorMessage: {
      type: String,
      required: true,
    }
  },
  emits: ['update:modelValue'],
})
</script>

<template>
  <div class="field" data-cy="BodyField">
    <label class="label" :htmlFor="`comment-${name}`"> {{label}} </label>

    <div class="control">
      <textarea
        :id="`comment-${name}`"
        :name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{
          'is-danger': error,
        }"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">{{errorMessage}}</p>
  </div>
</template>
