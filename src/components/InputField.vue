<template lang="">
  <div class="field">
    <label class="label" :htmlFor="inputId"> {{ inputLabel }} </label>
    <div class="control has-icons-left has-icons-right">
      <input
        class="input"
        :type="inputType"
        :name="inputName"
        :id="inputId"
        :placeholder="inputPlaceholder"
        :class="{ 'is-danger': errorMessage }"
        :value="title"
        @input="handleUpdateInput($event.target.value)"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user" v-if="inputType === 'text'" />
        <i class="fas fa-envelope" v-if="inputType === 'email'" />
      </span>

      <span v-if="errorMessage" class="icon is-small is-right has-text-danger">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
  </div>
</template>
<script>
export default {
  name: 'NameField',
  props: {
    errorMessage: String,
    title: String,
    inputLabel: String,
    inputType: String,
    inputName: String,
    inputId: String,
    inputPlaceholder: String
  },
  methods: {
    handleUpdateInput(value) {
      this.$emit('update:title', value);
      if (value.trim()) {
        this.$emit('update:errorMessage', '');
      }
    }
  }
};
</script>
<style lang=""></style>
