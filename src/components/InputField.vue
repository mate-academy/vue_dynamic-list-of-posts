<script setup>
  const props = defineProps({
    inputTitle: String,
    inputName: String,
    placeholder: String,
    icon: String,
    inputType: String,
    modelValue: String,
    incorrectTitle: Boolean,
  });
</script>
<template>
  <div class="field" data-cy="NameField">
    <label class="label" :htmlFor="`comment-author-name-${inputName}`">
      {{ inputTitle }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :type="inputType"
        :name="inputName"
        :id="`comment-author-name-${inputName}`"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="input"
        :class="{ 'is-danger': incorrectTitle}"
      />
      <span class="icon is-small is-left">
        <i class="fas" :class="icon"></i>
      </span>

      <span
        v-if="incorrectTitle"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p
      v-if="incorrectTitle"
      class="help is-danger"
      data-cy="ErrorMessage"
    >
      error text
    </p>
  </div>
</template>