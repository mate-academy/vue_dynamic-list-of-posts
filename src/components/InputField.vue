<script setup>
defineProps({
  label: String,
  error: String,
  name: String,
  modelValue: String,

});
</script>

<template>
  <div class="field">
    <label class="label" :for="name">
      {{ label }}
    </label>

    <div class="control has-icons-left has-icons-right">
      <input type="text" :name="name" :id="name" placeholder="" class="input" :class="{ 'is-danger': error }"
        :value="modelValue" />

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span v-if="error" class="icon is-small is-right has-text-danger">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger">{{ error }}</p>
  </div>
</template>

<style scope></style>
