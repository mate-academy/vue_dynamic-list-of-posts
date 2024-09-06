<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  handleClose: () => void;
  handleAddComment: () => void;
  comment: { name: string; email: string; body: string };
}>();

const nameError = ref(false);
const emailError = ref(false);
const bodyError = ref(false);
const sending = ref(false);

const handleValidate = () => {
  if (props.comment.name.length <= 0) {
    nameError.value = true;
  }
  if (!isValidEmail(props.comment.email)) {
    emailError.value = true;
  }
  if (props.comment.body.length <= 0) {
    bodyError.value = true;
  }

  if (!nameError.value && !emailError.value && !bodyError.value) {
    sending.value = true;
    props.handleAddComment();
  }
};

const handleCancel = () => {
  handleClearForm();
  props.handleClose();
};

const handleResetErrors = () => {
  nameError.value = false;
  emailError.value = false;
  bodyError.value = false;
};

const handleClearForm = () => {
  props.comment.name = "";
  props.comment.email = "";
  props.comment.body = "";
  nameError.value = false;
  emailError.value = false;
  bodyError.value = false;
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
</script>

<template>
  <div class="tile is-child is-success flex-itemDown">
    <div class="content">
      <form @submit.prevent="handleValidate" @input="handleResetErrors">
        <div class="field">
          <label class="label" for="post-title">Author Name</label>
          <div class="control has-icons-left has-icons-right">
            <input
              type="text"
              name="name"
              id="comment-name"
              placeholder="Name Surname"
              v-model="comment.name"
              class="input"
              :class="{ 'is-danger': nameError }"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user" />
            </span>

            <span
              class="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
              v-if="nameError"
            >
              <i class="fas fa-exclamation-triangle" />
            </span>
          </div>
          <p class="help is-danger" data-cy="ErrorMessage" v-if="nameError">
            Name is required
          </p>
        </div>

        <div class="field">
          <label class="label" for="user-email">Author Email</label>

          <div class="control has-icons-left has-icons-right">
            <input
              type="text"
              id="user-email"
              name="email"
              class="input"
              placeholder="Your email"
              :class="{ 'is-danger': emailError }"
              v-model="comment.email"
            />

            <span class="icon is-small is-left">
              <i class="fas fa-envelope" />
            </span>

            <span
              class="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
              v-if="emailError"
            >
              <i class="fas fa-exclamation-triangle" />
            </span>
          </div>

          <p class="help is-danger" data-cy="ErrorMessage" v-if="emailError">
            Email is required
          </p>
        </div>

        <div class="field" data-cy="BodyField">
          <label class="label" for="post-body"> Write Post Body </label>
          <div class="control">
            <textarea
              id="post-body"
              name="body"
              placeholder="Comment"
              v-model="comment.body"
              class="textarea"
              :class="{ 'is-danger': bodyError }"
            ></textarea>
          </div>

          <p class="help is-danger" data-cy="ErrorMessage" v-if="bodyError">
            Comment is required
          </p>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button
              type="submit"
              class="button is-link"
              :class="{ 'is-loading': sending }"
            >
              Add Comment
            </button>
          </div>
          <div class="control">
            <button
              type="reset"
              class="button is-link is-light"
              @click="handleClearForm"
            >
              Clear
            </button>
          </div>
          <div class="control">
            <button
              type="reset"
              class="button is-link is-light"
              @click="handleCancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
