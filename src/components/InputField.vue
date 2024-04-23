<script>
  export default {
    name: 'InputField',
    props: {
      title: String,
      inputName: String,
      errorMessage: String,
      placeholder: String,
      modelValue: String,
      type: String,
    },
    emits: ['update:modelValue'],
  }
</script>

<template>
  <div class="field">
    <label class="label" :htmlFor="`comment-author-name-${inputName}`">
      {{ title }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :type="type"
        class="input"
        :name="inputName"
        :id="`comment-author-name-${inputName}`"
        :placeholder="placeholder"
        :class="{ 'is-danger': errorMessage }"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span class="icon is-small is-left">
        <i 
          class="fas" 
          :class="type === 'email' ? 'fa-envelope' : 'fa-user'"
        ></i>
      </span>

      <span
        class="icon is-small is-right has-text-danger"
        v-if="errorMessage"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>