<script>
  export default {
    name: 'InputField',
    props: {
      modelValue: String,
      inputError: String,
      label: String,
      placeholder: String,
      icon: String,
      id: String,
    },
    emits: ['update:modelValue', 'input'],
    data() {
      return {
        internalValue: this.modelValue || '',
      }
    },
    watch: {
      modelValue(val) {
        this.internalValue = val
      },
      internalValue(val) {
        this.$emit('update:modelValue', val)
        this.$emit('input')
      },
    },
  }
</script>

<template>
  <div class="field">
    <label class="label" :for="id">{{ label }}</label>
    <div class="control has-icons-left has-icons-right">
      <input
        v-model="internalValue"
        :id="id"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': inputError && inputError.length }"
      />
      <span class="icon is-small is-left">
        <i class="fas" :class="icon"></i>
      </span>

      <span v-if="inputError && inputError.length" class="icon is-small is-right has-text-danger">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>
    <p v-if="inputError && inputError.length" class="help is-danger">{{ inputError }}</p>
  </div>
</template>

<style></style>
