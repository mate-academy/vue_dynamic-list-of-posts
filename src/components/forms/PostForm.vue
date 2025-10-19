<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          v-model="localForm.title"
          class="input"
          type="text"
          placeholder="Enter post title"
          @input="clearError('title')"
        />
      </div>
      <p v-if="localErrors.title" class="help is-danger">{{ localErrors.title }}</p>
    </div>

    <div class="field">
      <label class="label">Body</label>
      <div class="control">
        <textarea
          v-model="localForm.body"
          class="textarea"
          placeholder="Enter post content"
          @input="clearError('body')"
        ></textarea>
      </div>
      <p v-if="localErrors.body" class="help is-danger">{{ localErrors.body }}</p>
    </div>

    <div class="field is-grouped is-grouped-right">
      <div class="control">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isSubmitting }"
        >
          {{ saveLabel }}
        </button>
      </div>
      <div class="control">
        <button type="button" class="button" @click="clearForm">
          Clear
        </button>
      </div>
    </div>

    <div v-if="submitError" class="notification is-danger mt-3">
      Failed to submit post. Please try again.
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  form: Object,
  errors: Object,
  isSubmitting: Boolean,
  submitError: Boolean,
  saveLabel: {
    type: String,
    default: 'Create',
  },
});

const emit = defineEmits(['update:form', 'update:errors', 'clear', 'submit']);

const localForm = ref({ ...props.form });
const localErrors = ref({ ...props.errors });

watch(
  () => props.form,
  (newVal) => {
    localForm.value = { ...newVal };
  },
  { deep: true }
);

function clearError(field) {
  localErrors.value[field] = '';
  emit('update:errors', { ...localErrors.value });
}

function clearForm() {
  localForm.value = { title: '', body: '' };
  localErrors.value = {};
  emit('update:form', { ...localForm.value });
  emit('update:errors', {});
  emit('clear');
}

function handleSubmit() {
  emit('update:form', { ...localForm.value });
  emit('submit');
}
</script>
