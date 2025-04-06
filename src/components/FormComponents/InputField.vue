<script>
export default {
  name: 'InputField',
  props: {
    title: String,
    placeholder: String,
    modelValue: String,
    errorMessage: String,
    type: {
      type: String,
      default: 'name',
    },
  },
  emits: ['update:modelValue', 'deleteError'],
  methods: {
    handleInputChange(event) {
      this.$emit('update:modelValue', event.target.value), this.$emit('deleteError')
    },
  },
}
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" htmlFor="{`comment-author-name-${name}`}">
      {{ title }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        name="{name}"
        id="{`comment-author-name-${name}`}"
        :placeholder="placeholder"
        class="input"
        :class="{
          'is-danger': errorMessage,
        }"
        :value="modelValue"
        @change="handleInputChange"
      />
      <span v-if="type === 'name'" class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
      <span v-if="type === 'email'" class="icon is-small is-left">
        <i class="fas fa-envelope"></i>
      </span>

      <span v-if="errorMessage" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="errorMessage" class="help is-danger" data-cy="ErrorMessage">{{ errorMessage }}</p>
  </div>
</template>
