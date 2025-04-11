<template>
  <div class="field">
    <label class="label" htmlFor="user-name"> Your Name </label>

    <div class="control has-icons-left" :class="{ 'is-loading': loading }">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        required
        minlength="{4}"
        :value="registerNameModel"
        @input="$emit('update:registerNameModel', ($event.target as HTMLInputElement).value)"
        :disabled="loading"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>
    </div>

    <ErrorMessage v-if="errorMessage"> Error </ErrorMessage>
  </div>
</template>

<script lang="ts">
import ErrorMessage from './ErrorMessage.vue'

export default {
  data(): {
    errorMessage: string
  } {
    return {
      errorMessage: '',
    }
  },
  emits: ['update:registerNameModel'],
  props: {
    registerNameModel: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
    },
  },
  components: {
    ErrorMessage,
  },
}
</script>
