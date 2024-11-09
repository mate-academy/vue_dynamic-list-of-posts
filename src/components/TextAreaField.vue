<script setup>
const emit = defineEmits(['update:modelValue']);

defineProps({
  label: String,
  error: String,
  name: String,
  modelValue: String,
})

const handleInput = (event) => {
  if (event.target.value === '') {
    emit('update:modelValue');
  }
};
</script>

<template>
  <div class="field">
    <label class="label" :for="name">{{ label }}</label>
    <div class="control">
      <textarea :id="name" :name="name" placeholder="" class="textarea" :class="{ 'is-danger': error }"
        :value="modelValue" @input="handleInput"></textarea>
    </div>

    <p v-if="error" class="help is-danger">{{ error }}</p>
  </div>
</template>

<style scope></style>
