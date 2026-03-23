<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  errorMessage: String,
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label">
      {{ label }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        class="input"
        type="text"
        :placeholder="placeholder"
        :value="modelValue"
        @input="updateValue"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span
        v-if="errorMessage"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">{{ errorMessage }}</p>
  </div>
</template>
