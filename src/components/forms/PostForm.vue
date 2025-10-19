<template>
  <div>
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          v-model="form.title"
          class="input"
          type="text"
          placeholder="Enter post title"
          @input="errors.title = ''"
        />
      </div>
      <p v-if="errors.title" class="help is-danger">{{ errors.title }}</p>
    </div>

    <div class="field">
      <label class="label">Body</label>
      <div class="control">
        <textarea
          v-model="form.body"
          class="textarea"
          placeholder="Enter post content"
          @input="errors.body = ''"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
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
        <button type="button" class="button" @click="$emit('clear')">
          Clear
        </button>
      </div>
    </div>

    <div v-if="submitError" class="notification is-danger mt-3">
      Failed to submit post. Please try again.
    </div>
  </div>
</template>

<script setup>
defineProps({
  form: Object,
  errors: Object,
  isSubmitting: Boolean,
  submitError: Boolean,
  saveLabel: {
    type: String,
    default: 'Create',
  },
});

defineEmits(['submit', 'clear']);
</script>
