<script setup>
const props = defineProps({
  title: String,
  name: String,
  errorMessage: String,
  placeholder: String,
});

const model = defineModel();
</script>

<template>
  <div class="field" data-cy="NameField">
    <label class="label" :htmlFor="`comment-author-name-${name}`">
      {{ title }}
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        v-model="model"
        type="text"
        :name="name"
        :id="`comment-author-name-${name}`"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': errorMessage }"
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

    <p v-if="errorMessage" class="help is-danger" data-cy="ErrorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
