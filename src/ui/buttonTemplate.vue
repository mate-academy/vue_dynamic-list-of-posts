<script lang="ts">
import type { ButtonHTMLAttributes, PropType } from 'vue'

export default {
  props: {
    buttonType: {
      type: String as PropType<ButtonHTMLAttributes['type']>,
      required: true
    },
    submitting: Boolean,
    label: String
  },

  emits: ['handleButton'],

  methods: {
    handleClick() {
      this.$emit('handleButton')
    }
  }
}
</script>

<template>
  <button
    v-if="buttonType === 'submit'"
    :type="buttonType"
    class="button"
    :class="{ 'is-loading': submitting }"
    :disabled="submitting"
  >
    {{ label }}
  </button>

  <button v-else :type="buttonType" class="button is-link" @click="handleClick">{{ label }}</button>
</template>
