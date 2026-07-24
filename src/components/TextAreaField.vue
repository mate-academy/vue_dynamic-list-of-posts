<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  error: String,
});

const model = defineModel();
</script>

<template>
  <div class="field" >
    <label class="label" :for="`${label}`"> {{ label }} </label>
    <div class="control">
      <textarea
        v-model="model"
        :id="`${label}`"
        name="name"
        :placeholder="placeholder"
        class="textarea"
        :class="{ 'is-danger': !!error }"
      ></textarea>
    </div>

    <p v-if="error" class="help is-danger" >{{ error }}</p>
  </div>
</template>
