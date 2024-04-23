<script>
  export default {
    name: 'NeedToRegister',
    props: {
      loading: Boolean,
      modelValue: String,
    },
    emits: ['update:modelValue']
  }
</script>

<template>
  <div class="field">
    <label class="label" htmlFor="user-name"> Your Name </label>

    <div class="control has-icons-left" :class="{ ['is-loading']: loading }">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        required
        minlength="4"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
    </div>
  </div>
</template>