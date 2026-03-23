<script setup lang="ts">
import InputField from "./inputField.vue";
import TextAreaField from "./textAreaField.vue";
import useSidebarStore from "@/stores/sidebarStore";
import { ref, watch } from "vue";
import useUserStore from "@/stores/userStore";
import usePostsStore from "@/stores/postsStore";

const userStore = useUserStore();
const postsStore = usePostsStore();
const sidebarStore = useSidebarStore();

const titleError = ref("");
const bodyError = ref("");
const error = ref("");

const isLoading = ref(false);

const title = ref("");
const body = ref("");

const handleCancel = () => {
  sidebarStore.close();
  sidebarStore.openNewPost = false;
  sidebarStore.writeACommentBtn = false;
};

const validate = () => {
  let isValid = true;

  if (!title.value.trim()) {
    titleError.value = "Title is required";
    isValid = false;
  } else {
    titleError.value = "";
  }

  if (!body.value.trim()) {
    bodyError.value = "Post body is required";
    isValid = false;
  } else {
    bodyError.value = "";
  }

  return isValid;
};

watch(title, () => {
  titleError.value = "";
  error.value = "";
});

watch(body, () => {
  bodyError.value = "";
  error.value = "";
});

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!validate()) return;

  const newPost = {
    userId: userStore.user.id,
    title: title.value,
    body: body.value,
  };

  isLoading.value = true;

  try {
    const created = await postsStore.addPost(newPost);

    if (created) {
      postsStore.setActivePost(created.id);
      sidebarStore.openNewPost = false;
      sidebarStore.open();
    }
  } catch (error) {
    error.value = `Error creating post: ${error}`;
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteError = () => {
  error.value = "";
};
</script>

<template>
  <div class="content">
    <h2>Create new post</h2>

    <form>
      <InputField
        name="title"
        label="Title"
        placeholder="Post title"
        v-model="title"
        :errorMessage="titleError"
      />

      <TextAreaField
        name="postBody"
        label="Write Post Body"
        placeholder="Post body"
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
            Create
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
    </form>
  </div>
</template>
