<script setup>
import { ref, watch } from "vue";
import { createComment } from "@/api/comments";

import InputField from "./inputField.vue";
import TextAreaField from "./textAreaField.vue";
import usePostsStore from "@/stores/postsStore";
import useSidebarStore from "@/stores/sidebarStore";
import useCommentsStore from "@/stores/commentsStore";

const postsStore = usePostsStore();
const sidebarStore = useSidebarStore();
const commentsStore = useCommentsStore();

const nameError = ref("");
const emailError = ref("");
const bodyError = ref("");
const error = ref("");

const isLoading = ref(false);

const authorName = ref("");
const authorEmail = ref("");
const body = ref("");

const handleCancel = () => {
  sidebarStore.writeACommentBtn = false;

  authorName.value = "";
  authorEmail.value = "";
  body.value = "";

  nameError.value = "";
  emailError.value = "";
  bodyError.value = "";
};

const handleDeleteError = () => {
  error.value = "";
};

const validate = () => {
  let isValid = true;

  if (!authorName.value.trim()) {
    nameError.value = "Name is required";
    isValid = false;
  } else {
    nameError.value = "";
  }

  if (!authorEmail.value.trim()) {
    emailError.value = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail.value)) {
    emailError.value = "Email is invalid";
    isValid = false;
  } else {
    emailError.value = "";
  }

  if (!body.value.trim()) {
    bodyError.value = "Comment body is required";
    isValid = false;
  } else {
    bodyError.value = "";
  }

  return isValid;
};

watch(authorName, () => {
  nameError.value = "";
  error.value = "";
});

watch(authorEmail, () => {
  emailError.value = "";
  error.value = "";
});

watch(body, () => {
  bodyError.value = "";
  error.value = "";
});

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validate()) return;

  const newComment = {
    postId: postsStore.activePostId,
    name: authorName.value,
    email: authorEmail.value,
    body: body.value,
  };

  isLoading.value = true;

  try {
    const response = await createComment(newComment);
    const created = response.data;

    commentsStore.addComment(created, postsStore.activePostId);

    body.value = "";
  } catch (error) {
    error.value = `Error creating comment: ${error}`;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form>
    <InputField
      name="fullName"
      label="Author Name"
      placeholder="Name Surname"
      v-model="authorName"
      :errorMessage="nameError"
    />

    <InputField
      name="email"
      label="Author Email"
      placeholder="Your Email"
      v-model="authorEmail"
      :errorMessage="emailError"
    />

    <TextAreaField
      label="Write Post Body"
      name="comment"
      placeholder="Comment"
      v-model="body"
      :error-message="bodyError"
    />

    <div class="field is-grouped">
      <div class="control">
        <button
          @click="handleSubmit"
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isLoading }"
          :disabled="isLoading"
        >
          Add Comment
        </button>
      </div>
      <div class="control">
        <button
          @click="handleCancel"
          type="reset"
          class="button is-link is-light"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
  <article v-if="error" class="message is-danger" style="margin-top: 10px">
    <div class="message-header">
      <p>Error Message</p>
      <button
        @click="handleDeleteError"
        class="delete"
        aria-label="delete"
      ></button>
    </div>
    <div class="message-body">
      {{ error }}
    </div>
  </article>
</template>
