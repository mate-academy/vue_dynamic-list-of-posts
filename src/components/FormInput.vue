<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  type: { type: String, default: "text" },
  icon: { type: String, default: "fa-user" },
});

const model = defineModel();
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :for="`post-${name}`">
      {{ title }}
    </label>

    <div class="control has-icons-left has-icons-right">
      <input
        v-model="model"
        :type="type"
        :name="name"
        :id="`post-${name}`"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': error }"
      />

      <span class="icon is-small is-left">
        <i class="fas" :class="icon"></i>
      </span>

      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>