<script setup lang="ts">
defineProps<{
  title: string;
  name: string;
  placeholder: string;
  errorText: string;
}>();
</script>

<template>
  <div
    class="field"
    data-cy="NameField"
  >
    <label
      class="label"
      :for="`comment-author-name-${name}`"
    >
      {{ title }}
    </label>

    <div class="control has-icons-left has-icons-right">
      <input
        :id="`comment-author-name-${name}`"
        :name="name"
        :placeholder="placeholder"
        type="text"
        class="input is-danger"
      >

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p
      class="help is-danger"
      data-cy="ErrorMessage"
    >
      {{ errorText }}
    </p>
  </div>
</template>