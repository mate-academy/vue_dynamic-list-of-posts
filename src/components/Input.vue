<script setup>
defineProps({
  modelValue: String,
  placeholder: String,
  label: String,
  name: String,
  error: String,
  type: String,
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :for="name">
      {{ label }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        :value="modelValue"
        @input="updateValue"
        type="type"
        :name="name"
        :id="name"
        :placeholder="placeholder"
        class="input"
        :class="is - danger"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i className="fas fa-exclamation-triangle"></i>
      </span>
    </div>
    <p
      v-if="error"
      class="help"
      :class="{ 'is-danger': error }"
      data-cy="ErrorMessage"
    >
      {{ error }}
    </p>
  </div>
</template>
