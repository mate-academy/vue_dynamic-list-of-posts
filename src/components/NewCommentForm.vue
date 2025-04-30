<script setup>
  import { postComment } from '@/api/comments';
  import Input from './Input.vue';
  import TextArea from './TextArea.vue';
  import { ref } from 'vue';
  import { ERROR_MESSAGES } from '@/utils/errorMessages';
  import { EMAIL_PATTERN } from '@/utils/emailRegex';

  const { postId } = defineProps({
    postId: {
      type: Number,
      required: true,
    },
  });

  const INITIAL_ERRORS = {
    nameError: ERROR_MESSAGES.NONE,
    emailError: ERROR_MESSAGES.NONE,
    bodyError: ERROR_MESSAGES.NONE,
  };

  const isNewCommentFormShown = defineModel('isNewCommentFormShown', { type: Boolean });
  const comments = defineModel('comments', { type: Array });

  const name = ref('');
  const email = ref('');
  const body = ref('');
  const errors = ref({ ...INITIAL_ERRORS });

  const onSubmit = async () => {
    errors.value = { ...INITIAL_ERRORS };

    if (!name.value.trim()) {
      errors.value.nameError = ERROR_MESSAGES.NAME_REQUIRED;
    }

    if (!email.value.trim()) {
      errors.value.emailError = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!EMAIL_PATTERN.test(email.value.trim())) {
      errors.value.emailError = ERROR_MESSAGES.EMAIL_INVALID;
    }

    if (!body.value.trim()) {
      errors.value.bodyError = ERROR_MESSAGES.BODY_REQUIRED;
    }

    if (errors.value.nameError || errors.value.emailError || errors.value.bodyError) {
      return;
    }

    try {
      const newComment = await postComment(
        postId,
        name.value.trim(),
        email.value.trim(),
        body.value.trim(),
      );

      comments.value.push(newComment);

      name.value = '';
      email.value = '';
      body.value = '';
      isNewCommentFormShown.value = false;
    } catch (error) {
      console.error(error);
    }
  };
</script>

<template>
  <div class="content">
    <form @submit.prevent="onSubmit">
      <Input
        v-model="name"
        v-model:error="errors.nameError"
        title="Author name"
        icon="fa-user"
        placeholder="Name Surname"
      />

      <Input
        v-model="email"
        v-model:error="errors.emailError"
        type="email"
        title="Author Email"
        icon="fa-envelope"
        placeholder="Your Email"
      />

      <TextArea
        v-model="body"
        v-model:error="errors.bodyError"
        title="Write Comment Body"
        placeholder="Comment"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Add Comment</button>
        </div>

        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="isNewCommentFormShown = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
