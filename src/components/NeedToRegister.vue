<script>
export default {
  name: 'NeedToRegister',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    errMessage: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'onInput'],
};
</script>

<template>
  <div class="message is-warning">
    <div class="message-header">
      <p>Registration Needed</p>
    </div>
    <div class="message-body">
      <p>
        It looks like you don't have an account with this email. Please enter
        your name to register.
      </p>
      <div class="field mt-3">
        <label class="label" for="user-name">Name</label>
        <div class="control has-icons-left">
          <input
            id="user-name"
            type="text"
            name="name"
            class="input"
            placeholder="Enter your name"
            :value="modelValue"
            :class="{ 'is-danger': errMessage }"
            required
            @input="
              $emit('update:modelValue', $event.target.value);
              $emit('onInput');
            "
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
        <p v-if="errMessage" class="help is-danger">{{ errMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
