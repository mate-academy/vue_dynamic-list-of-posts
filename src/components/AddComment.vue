<script setup>
import { ref } from "vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import { usePostStore } from "@/stores/posts";
import { useCommentsStore } from "@/stores/comments";

const postStore = usePostStore();
const commentStore = useCommentsStore();

const formData = ref({
  name: commentStore.author.name || "",
  email: commentStore.author.email || "",
  message: "",
});

const errors = ref({
  name: null,
  email: null,
  message: null,
});

const isSubmitting = ref(false);

const validateForm = () => {
  let isValid = true;

  if (!formData.value.name.trim()) {
    errors.value.name = "Name is required";
    isValid = false;
  } else {
    errors.value.name = null;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.value.email.trim()) {
    errors.value.email = "Email is required";
    isValid = false;
  } else if (!emailPattern.test(formData.value.email)) {
    errors.value.email = "Invalid email format";
    isValid = false;
  } else {
    errors.value.email = null;
  }

  if (!formData.value.message.trim()) {
    errors.value.message = "Message is required";
    isValid = false;
  } else {
    errors.value.message = null;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (validateForm()) {
    isSubmitting.value = true;

    const newComment = {
      postId: postStore.currentPost.id,
      name: formData.value.name,
      email: formData.value.email,
      body: formData.value.message,
    };

    try {
      await commentStore.createNewComment(newComment);
      handleClearMessage();
    } catch (error) {
      alert(error.message);
    } finally {
      isSubmitting.value = false;
    }
  }
};

const handleClearErrors = () => {
  errors.value.name = null;
  errors.value.email = null;
  errors.value.message = null;
};

const handleClearMessage = () => {
  formData.value.message = "";
};

const handleReset = () => {
  handleClearMessage();
  handleClearErrors();
  commentStore.notShowCommentForm();
  postStore.showDetailsPost();
};
</script>

<template>
  <div class="content">
    <h2>Create new comment</h2>

    <form @submit.prevent="handleSubmit" @reset="handleReset">
      <InputField
        name="Author Name"
        placeholder="Name Surname"
        v-model="formData.name"
        :error="errors.name"
        @clearErrors="handleClearErrors"
      />
      <InputField
        name="Author Email"
        placeholder="Your Email"
        v-model="formData.email"
        :error="errors.email"
        @clearErrors="handleClearErrors"
      />
      <TextAreaField
        name="Write Comment Body"
        placeholder="Comment"
        v-model="formData.message"
        :error="errors.message"
        @clearErrors="handleClearErrors"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isSubmitting }"
          >
            Save
          </button>
        </div>
        <div class="control">
          <button
            v-if="!isSubmitting"
            type="reset"
            class="button is-link is-light"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
