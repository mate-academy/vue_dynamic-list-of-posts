<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { usePostsStore } from "@/stores/postsStore";
import { useSidebarStore } from "@/stores/sidebarStore";

import InputField from "./inputField.vue";
import TextAreaField from "./textAreaField.vue";

const sidebarStore = useSidebarStore();

const title = ref("");
const body = ref("");
const nameError = ref("");
const bodyError = ref("");

const userStore = useUserStore();
const postsStore = usePostsStore();

const handleCancel = (e) => {
  e.preventDefault();
  sidebarStore.close();
};

const handleSubmit = async () => {
  nameError.value = "";
  bodyError.value = "";

  let hasError = false;

  if (!title.value.trim()) {
    nameError.value = "Title is required";
    hasError = true;
  }

  if (!body.value.trim()) {
    bodyError.value = "Body is required";
    hasError = true;
  }

  if (hasError) return;

  const newPost = {
    userId: userStore.user.id,
    title: title.value,
    body: body.value,
  };

  const createdPost = await postsStore.addPost(newPost);

  if (!createdPost) {
    console.error("Post was not created");
    return;
  }

  postsStore.activePostId = createdPost.id;
  sidebarStore.openNewPost = false;
  sidebarStore.editPost = false;
  sidebarStore.writeACommentBtn = false;

  title.value = "";
  body.value = "";
};
</script>

<template>
  <div class="content">
    <h2>Create new post</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        label="Title"
        placeholder="Post title"
        v-model="title"
        :errorMessage="nameError"
      />
      <TextAreaField
        label="Write Post Body"
        placeholder="Post body"
        v-model="body"
        :errorMessage="bodyError"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Create</button>
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
</template>
