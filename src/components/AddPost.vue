<script setup>
import { ref } from "vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import { useUserStore } from "@/stores/user";
import { usePostStore } from "@/stores/posts";

const userStore = useUserStore();
const postStore = usePostStore();

const formData = ref({
  title: postStore.isUpdatingPost ? postStore.currentPost.title : "",
  body: postStore.isUpdatingPost ? postStore.currentPost.body : "",
});

const errors = ref({
  title: null,
  body: null,
});

const isSubmitting = ref(false);

const validateForm = () => {
  let isValid = true;

  if (!formData.value.title.trim()) {
    errors.value.title = "Name is required";
    isValid = false;
  } else {
    errors.value.title = null;
  }

  if (!formData.value.body.trim()) {
    errors.value.body = "Message is required";
    isValid = false;
  } else {
    errors.value.body = null;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (validateForm()) {
    isSubmitting.value = true;

    const updatedPost = {
      title: formData.value.title,
      body: formData.value.body,
    };

    try {
      if (postStore.isUpdatingPost) {
        await postStore.updatePost(postStore.currentPost.id, updatedPost)
      } else {
        await postStore.createNewPost({
          userId: userStore.user.id,
          ...updatedPost,
        })
      }
      handleReset();
      postStore.notShowPostForm();
      postStore.notUpdatingPost();
    } catch (error) {
      alert(error.message);
    } finally {
      isSubmitting.value = false;
    }
  }
};

const handleClearErrors = () => {
  errors.value.title = null;
  errors.value.body = null;
};

const handleReset = () => {
  formData.value.title = "";
  formData.value.body = "";
  handleClearErrors();
  postStore.notShowPostForm();
  postStore.notUpdatingPost();
};
</script>

<template>
  <h2>Create new post</h2>

  <form @submit.prevent="handleSubmit" @reset="handleReset">
    <InputField
      name="Title"
      placeholder="Post title"
      v-model="formData.title"
      :error="errors.title"
      @clearErrors="handleClearErrors"
    />

    <TextAreaField
      name="Write Post Body"
      placeholder="Post Body"
      v-model="formData.body"
      :error="errors.body"
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
</template>
