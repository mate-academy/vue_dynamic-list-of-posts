<template>
  <div class="field" data-cy="NameField">
    <label class="label" :htmlFor="`comment-author-name-${name}`"> {{ name }} </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        :name="name"
        :id="`comment-author-name-${name}`"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': textError }"
        :value="modelValue"
        @input="handleInput($event)"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span v-if="textError" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">{{ textError }}</p>
  </div>
</template>
<script lang="ts">
export default {
  name: 'InputField',
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
    handleInput(event: Event) {
      const target = event.target as HTMLInputElement

      this.$emit('update:modelValue', target.value)
    },
  },
}
</script>
