<script setup>
  import { ref } from 'vue';
  import Input from './Input.vue';
  import TextArea from './TextArea.vue';
  import { ERROR_MESSAGES } from '@/utils/errorMessages';

  const INITIAL_ERRORS = {
    titleError: ERROR_MESSAGES.NONE,
    bodyError: ERROR_MESSAGES.NONE,
  };

  const { onSubmit } = defineProps({
    onSubmit: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
  });

  const title = defineModel('title', { type: String });
  const body = defineModel('body', { type: String });
  const errors = ref({ ...INITIAL_ERRORS });

  const onFormSubmit = async () => {
    errors.value = { ...INITIAL_ERRORS };

    if (!title.value.trim()) {
      errors.value.titleError = ERROR_MESSAGES.TITLE_REQUIRED;
    }

    if (!body.value.trim()) {
      errors.value.bodyError = ERROR_MESSAGES.BODY_REQUIRED;
    }

    if (errors.value.titleError || errors.value.bodyError) {
      return;
    }

    await onSubmit();
  };
</script>

<template>
  <form @submit.prevent="onFormSubmit">
    <Input
      v-model="title"
      v-model:error="errors.titleError"
      title="Title"
      placeholder="New title"
      icon="fa-user"
    />
    <TextArea
      v-model="body"
      v-model:error="errors.bodyError"
      title="Write Post Body"
      placeholder="Post body"
    />

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Save</button>
      </div>

      <div class="control">
        <button type="reset" class="button is-link is-light" @click="onCancel">Cancel</button>
      </div>
    </div>
  </form>
</template>
