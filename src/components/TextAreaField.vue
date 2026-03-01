<script setup lang="ts">
defineProps<{
  modelValue: string;
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
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
      :for="`comment-${name}`"
    >{{ label }}</label>

    <div class="control">
      <textarea
        :id="`comment-${name}`"
        class="textarea"
        :class="{ 'is-danger': error }"
        :name="name"
        :rows="rows ?? 4"
        :placeholder="placeholder"
        :value="modelValue"
        @input="
          emit(
            'update:modelValue',
            ($event.target as HTMLTextAreaElement).value,
          )
        "
      />
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
