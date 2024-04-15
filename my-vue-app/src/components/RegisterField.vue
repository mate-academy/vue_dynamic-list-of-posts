<script>
export default {
  emits: ['changeName'],
  methods: {
    onChangeName($event) {
      this.$emit('changeName', $event.target.value);
    },
  },
};
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
      @input="onChangeName"
      required
      minlength="4"
    />

    <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>
  </div>

  <!-- <p class="help is-danger">error message</p> -->
</div>

</template>