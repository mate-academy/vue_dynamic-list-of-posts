<script setup>
import { ref } from 'vue';

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit', 'clear']);

const name = ref('');
const email = ref('');
const body = ref('');

const nameError = ref('');
const emailError = ref('');
const bodyError = ref('');

const clearErrors = () => {
  nameError.value = '';
  emailError.value = '';
  bodyError.value = '';
};

const validate = () => {
  clearErrors();

  if (!name.value.trim()) {
    nameError.value = 'Name is required';
  }

  if (!email.value.trim()) {
    emailError.value = 'Email is required';
  }

  if (!body.value.trim()) {
    bodyError.value = 'Comment is required';
  }

  return !nameError.value && !emailError.value && !bodyError.value;
};

const submit = () => {
  if (!validate()) {
    return;
  }

  emit('submit', {
    name: name.value.trim(),
    email: email.value.trim(),
    body: body.value.trim(),
  });

  body.value = '';
};

const clear = () => {
  body.value = '';
  clearErrors();
  emit('clear');
};
</script>

<template>
  <form
    class="box"
    @submit.prevent="submit"
  >
    <h3 class="title is-5">
      Write a comment
    </h3>

    <div
      class="field"
      data-cy="NameField"
    >
      <label
        class="label"
        for="comment-author-name"
      >
        Your Name
      </label>

      <div class="control has-icons-left has-icons-right">
        <input
          id="comment-author-name"
          v-model="name"
          type="text"
          name="name"
          placeholder="Enter your name"
          class="input"
          :class="{ 'is-danger': nameError }"
          @input="nameError = ''"
        />

        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>

        <span
          v-if="nameError"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p
        v-if="nameError"
        class="help is-danger"
        data-cy="ErrorMessage"
      >
        {{ nameError }}
      </p>
    </div>

    <div
      class="field"
      data-cy="EmailField"
    >
      <label
        class="label"
        for="comment-author-email"
      >
        Your Email
      </label>

      <div class="control has-icons-left has-icons-right">
        <input
          id="comment-author-email"
          v-model="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          class="input"
          :class="{ 'is-danger': emailError }"
          @input="emailError = ''"
        />

        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>

        <span
          v-if="emailError"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p
        v-if="emailError"
        class="help is-danger"
        data-cy="ErrorMessage"
      >
        {{ emailError }}
      </p>
    </div>

    <div
      class="field"
      data-cy="BodyField"
    >
      <label
        class="label"
        for="comment-body"
      >
        Comment
      </label>

      <div class="control">
        <textarea
          id="comment-body"
          v-model="body"
          name="body"
          placeholder="Write a comment"
          class="textarea"
          :class="{ 'is-danger': bodyError }"
          @input="bodyError = ''"
        ></textarea>
      </div>

      <p
        v-if="bodyError"
        class="help is-danger"
        data-cy="ErrorMessage"
      >
        {{ bodyError }}
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
        >
          Add comment
        </button>
      </div>

      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="clear"
        >
          Clear
        </button>
      </div>
    </div>
  </form>
</template>