<script>
export default {
  name: 'TextAreaField',
  props: {
    modelValue: String,
    textAreaName: String,
    textAreaError: String,
  },
  emits: ['update:modelValue', 'removeError'],
  data() {
    return {
      label: '',
      type: '',
      placeholder: '',
      internalValue: this.modelValue,
    }
  },
  mounted() {
    switch (this.textAreaName) {
      case 'postBody':
        this.label = 'Write Post Body'
        this.placeholder = 'Post body'
        break
      case 'commentBody':
        this.label = 'Write Comment'
        this.placeholder = 'Comment'
        break
      default:
        break
    }
  },
  watch: {
    modelValue(newVal) {
      this.internalValue = newVal
    },
    internalValue(newVal) {
      this.$emit('update:modelValue', newVal)
    },
  },
}
</script>

<template>
  <div class="field">
    <label class="label" :htmlFor="textAreaName">{{ label }} </label>
    <div class="control">
      <textarea
        :id="textAreaName"
        :name="textAreaName"
        :placeholder="placeholder"
        class="textarea"
        :class="textAreaError"
        v-model="internalValue"
        @input="$emit('removeError')"
      ></textarea>
    </div>

    <p class="help is-danger" v-if="textAreaError">{{ textAreaError }}</p>
  </div>
</template>
