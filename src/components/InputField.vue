<script>
export default {
  name: 'InputField',
  props: {
    modelValue: String,
    inputName: String,
    inputError: String,
  },
  emits: ['update:modelValue', 'removeError'],
  data() {
    return {
      label: '',
      type: '',
      placeholder: '',
      iconClass: '',
      internalValue: this.modelValue,
    }
  },
  mounted() {
    switch (this.inputName) {
      case 'postTitle':
        this.label = 'Title'
        this.type = 'text'
        this.placeholder = 'Post title'
        this.iconClass = 'fa-user'
        break
      case 'commentAuthor':
        this.label = 'Author Name'
        this.type = 'text'
        this.placeholder = 'Name Surname'
        this.iconClass = 'fa-user'
        break
      case 'commentAuthorEmail':
        this.label = 'Author Email'
        this.type = 'email'
        this.placeholder = 'Your Email'
        this.iconClass = 'fa-envelope'
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
    <label class="label" :htmlFor="inputName">
      {{ label }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :type="type"
        :name="inputName"
        :id="inputName"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': inputError }"
        v-model="internalValue"
        @input="$emit('removeError')"
      />
      <span class="icon is-small is-left">
        <i class="fas" :class="iconClass"></i>
      </span>

      <span class="icon is-small is-right has-text-danger" v-if="inputError">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger" v-if="inputError">{{ inputError }}</p>
  </div>
</template>
