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

const authorName = ref("");
const authorEmail = ref("");
const body = ref("");

const handleCancel = () => {
  sidebarStore.writeACommentBtn = false;
}

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


const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validate()) return;

  const newComment = {
    postId: postsStore.activePostId,
    name: authorName.value,
    email: authorEmail.value,
    body: body.value,
  }

  try {
    await createComment(newComment);    
  } catch (error) {
    console.error("Error creating comment:", error);
  } finally {
    sidebarStore.writeACommentBtn = false;
  }
}
</script>

<template>
  <form>
    <InputField
      label="Author Name"
      placeholder="Name Surname"
      v-model="authorName"
    />
    <InputField
      label="Author Email"
      placeholder="Your Email"
      v-model="authorEmail"
    />
    <TextAreaField
      label="Write Post Body"
      placeholder="Comment"
      v-model="body"
    />
    <div class="field is-grouped">
      <div class="control">
        <button @click="handleSubmit" type="submit" class="button is-link">Add Comment</button>
      </div>
      <div class="control">
        <button @click="handleCancel" type="reset" class="button is-link is-light">Cancel</button>
      </div>
    </div>
  </form>
</template>
