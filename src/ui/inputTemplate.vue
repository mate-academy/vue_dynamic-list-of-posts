<!-- eslint-disable vue/no-textarea-mustache -->
<script lang="ts">
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    errorMessage: {
      type: String,
      required: true
    },
    error: {
      type: Boolean,
      required: true
    },
    inputType: {
      type: String,
      default: 'text'
    },
    textArea: {
      type: Boolean,
      default: false
    },
    icon: String,
    disabled: {
      type: Boolean,
      default: false
    },
    minLength: String
  },

  emits: ['update:modelValue']
}
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :htmlFor="id">{{ label }}</label>

    <div class="control has-icons-left">
      <textarea
        v-if="textArea"
        :id="id"
        :name="name"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': error }"
        >{{ modelValue }}</textarea
      >

      <input
        v-else
        :id="id"
        :type="inputType"
        :name="name"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': error }"
        :disabled="disabled"
        :minlength="minLength"
      />

      <template v-if="!textArea">
        <span class="icon is-small is-right has-text-danger" data-cy="ErrorIcon" v-if="error">
          <i class="fas fa-exclamation-triangle" />
        </span>

        <span class="icon is-small is-left" v-else>
          <i class="fas" :class="icon" />
        </span>
      </template>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage" v-if="error">{{ errorMessage }}</p>
  </div>
</template>
