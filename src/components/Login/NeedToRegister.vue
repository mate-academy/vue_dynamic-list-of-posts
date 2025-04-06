<script>
export default {
  name: 'NeedToRegister',

  data() {
    return {
      name: '',
      nameError: '',
    }
  },
}
</script>

<template>
  <div class="field">
    <label class="label" htmlFor="user-name"> Your Name </label>

    <div class="control has-icons-left">
      <input
        type="text"
        id="user-name"
        name="name"
        class="input"
        placeholder="Enter your name"
        v-model="name"
        required
        minlength="{4}"
        @input="nameError = ''"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>
    </div>

    <p class="help is-danger" v-if="nameError">
      {{ nameError }}
    </p>
  </div>
</template>
