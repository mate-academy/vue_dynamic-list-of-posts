<script>
export default {
  name: 'TextAreaField',
  props: {
    modelValue: String,
    bodyError: String,
    label: String,
    placeholder: String,
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
    <div class="control">
      <textarea
        v-model="internalValue"
        :id="id"
        class="textarea"
        :placeholder="placeholder"
        :class="{ 'is-danger': bodyError && bodyError.length }"
      ></textarea>
      <p v-if="bodyError && bodyError.length" class="help is-danger">{{ bodyError }}</p>
    </div>
  </div>
</template>

<style></style>
