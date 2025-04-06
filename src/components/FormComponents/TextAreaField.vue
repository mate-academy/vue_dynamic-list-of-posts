<script>
export default {
  name: 'TextAreaField',
  props: {
    title: String,
    placeholder: String,
    modelValue: String,
    errorMessage: String,
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
    <div class="control has-icons-right">
      <textarea
        type="text"
        name="{name}"
        id="{`comment-author-name-${name}`}"
        :placeholder="placeholder"
        :value="modelValue"
        @change="handleInputChange"
        class="textarea"
        :class="{
          'is-danger': errorMessage,
        }"
      ></textarea>

      <span v-if="errorMessage" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="errorMessage" class="help is-danger" data-cy="ErrorMessage">{{ errorMessage }}</p>
  </div>
</template>

<style></style>
