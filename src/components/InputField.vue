<script setup lang="ts">
defineProps<{
  modelValue: string;
  name: string;
  label: string;
  placeholder?: string;
  error?: string | null;
  cy: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <div
    class="field"
    :data-cy="cy"
  >
    <label
      class="label"
      :for="`comment-author-${name}`"
    >
      {{ label }}
    </label>

    <div class="control has-icons-left has-icons-right">
      <input
        :id="`comment-author-${name}`"
        type="text"
        class="input"
        :class="{ 'is-danger': error }"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      >

      <span class="icon is-small is-left">
        <i class="fas fa-user" />
      </span>

      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle" />
      </span>
    </div>

    <p
      v-if="error"
      class="help is-danger"
      data-cy="ErrorMessage"
    >
      {{ error }}
    </p>
  </div>
</template>
