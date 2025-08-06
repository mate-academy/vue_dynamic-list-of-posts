<script setup>
import { onMounted, ref } from "vue";
import { usePostsStore } from "@/stores/postsStore";
import { useSidebarStore } from "@/stores/sidebarStore";

import InputField from "./inputField.vue";
import TextAreaField from "./textAreaField.vue";

const postsStore = usePostsStore();
const sidebarStore = useSidebarStore();

const nameError = ref("");
const bodyError = ref("");

const post = ref(null);
const title = ref("");
const body = ref("");

onMounted(async () => {
  if (postsStore.activePostId) {
    const response = await postsStore.getPostByIdFromServer(
      postsStore.activePostId
    );
    if (response) {
      post.value = response.data;
      title.value = post.value.title;
      body.value = post.value.body;
    }
  }
});

const handleCancel = (e) => {
  e.preventDefault();
  sidebarStore.editPost = false;
};

const handleSave = async (e) => {
  nameError.value = "";
  bodyError.value = "";

  let hasError = false;

  e.preventDefault();

  if (!title.value.trim()) {
    nameError.value = "Title is required";
    hasError = true;
  }

  if (!body.value.trim()) {
    bodyError.value = "Body is required";
    hasError = true;
  }

  if (hasError) return;

  const trimmedTitle = title.value.trim();
  const trimmedBody = body.value.trim();

  const hasTitleChanged = trimmedTitle !== post.value.title.trim();
  const hasBodyChanged = trimmedBody !== post.value.body.trim();

  if (!hasTitleChanged && !hasBodyChanged) {
    sidebarStore.editPost = false;
    return;
  }

  const updatedFields = {
    userId: post.value.userId,
  };

  if (hasTitleChanged) {
    updatedFields.title = trimmedTitle;
  }

  if (hasBodyChanged) {
    updatedFields.body = trimmedBody;
  }

  try {
    await postsStore.updatePost(post.value.id, updatedFields);
    sidebarStore.editPost = false;
  } catch (error) {
    console.error("Error updating post:", error);
  }
};
</script>

<template>
  <div class="content">
    <h2>Post editing</h2>
    <form @submit="handleSave">
      <InputField
        v-model="title"
        placeholder="Post title"
        label="Title"
        :errorMessage="nameError"
      />
      <TextAreaField
        v-model="body"
        name="body"
        placeholder="Post body"
        label="Body"
        :errorMessage="bodyError"
      />
      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
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
  </div>
</template>
