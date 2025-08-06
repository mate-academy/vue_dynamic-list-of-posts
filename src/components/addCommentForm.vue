<script setup>
import { ref } from "vue";
import { useSidebarStore } from "@/stores/sidebarStore";
import { usePostsStore } from "@/stores/postsStore";
import { createComment } from "@/api/comments";

import InputField from "./inputField.vue";
import TextAreaField from "./textAreaField.vue";

const sidebarStore = useSidebarStore();
const postsStore = usePostsStore();

const nameError = ref("");
const emailError = ref("");
const bodyError = ref("");

const isLoading = ref(false);

const authorName = ref("");
const authorEmail = ref("");
const body = ref("");

const handleCancel = () => {
  body.value = "";
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
});

watch(authorEmail, () => {
  emailError.value = "";
});

watch(body, () => {
  bodyError.value = "";
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
    await createComment(newComment);
    body.value = "";
  } catch (error) {
    console.error("Error creating comment:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form>
    <InputField
      label="Author Name"
      placeholder="Name Surname"
      v-model="authorName"
      :errorMessage="nameError"
    />

    <InputField
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
</template>
