<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  handleClose: () => void;
  handleAddComment: (name: string, email: string, body: string) => void;
}>();

const name = ref("");
const email = ref("");
const body = ref("");

const nameError = ref(false);
const emailError = ref(false);
const bodyError = ref(false);

const handleValidate = () => {
  if (name.value.length <= 0) {
    nameError.value = true;
  }
  if (email.value.length <= 0) {
    emailError.value = true;
  }
  if (body.value.length <= 0) {
    bodyError.value = true;
  }

  if (!nameError.value && !emailError.value && !bodyError.value) {
    props.handleAddComment(name.value, email.value, body.value);
  }
};

const handleCancel = () => {
  name.value = "";
  email.value = "";
  body.value = "";

  nameError.value = false;
  emailError.value = false;
  bodyError.value = false;
  props.handleClose();
};

const handleResetErrors = () => {
  nameError.value = false;
  emailError.value = false;
  bodyError.value = false;
};
</script>

<template>
  <div class="tile is-child is-success flex-itemDown">
    <div class="content">
      <form @submit.prevent="handleValidate">
        <div class="field">
          <label class="label" for="post-title">Author Name</label>
          <div class="control has-icons-left has-icons-right">
            <input
              type="text"
              name="name"
              id="comment-name"
              placeholder="Name Surname"
              v-model="name"
              class="input"
              :class="{ 'is-danger': nameError }"
              @input="handleResetErrors"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user" />
            </span>

            <span
              class="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
              v-if="emailError"
            >
              <i class="fas fa-exclamation-triangle" />
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label" for="user-email">Author Email</label>

          <div class="control has-icons-left has-icons-right">
            <input
              type="email"
              id="user-email"
              name="email"
              class="input"
              placeholder="Your email"
              :class="{ 'is-danger': emailError }"
              v-model="email"
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
              v-model="body"
              class="textarea"
              :class="{ 'is-danger': bodyError }"
              @input="handleResetErrors"
            ></textarea>
          </div>

          <p class="help is-danger" data-cy="ErrorMessage" v-if="bodyError">
            Comment is required
          </p>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button type="submit" class="button is-link">Add Comment</button>
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
