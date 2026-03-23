<script setup lang="ts">
import { ref, watch, computed } from "vue";
import useSidebarStore from "@/stores/sidebarStore";
import usePostsStore from "@/stores/postsStore";
import TextAreaField from "./textAreaField.vue";
import InputField from "./inputField.vue";

const sidebarStore = useSidebarStore();
const postsStore = usePostsStore();

const activePost = computed(() =>
  postsStore.posts.find((p) => p.id === postsStore.activePostId),
);

const titleError = ref("");
const bodyError = ref("");
const error = ref("");
const isLoading = ref(false);

const title = ref(activePost.value?.title || "");
const body = ref(activePost.value?.body || "");

const handleCancel = () => {
  sidebarStore.editPost = false;
};

const validate = (title: string, body: string) => {
  let isValid = true;
  if (!title) {
    titleError.value = "Title is required";
    isValid = false;
  }
  if (!body) {
    bodyError.value = "Post body is required";
    isValid = false;
  }
  return isValid;
};

watch([title, body], () => {
  titleError.value = "";
  bodyError.value = "";
  error.value = "";
});

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  const currentTitle = title.value.trim();
  const currentBody = body.value.trim();

  if (!validate(currentTitle, currentBody) || !activePost.value) return;

  const hasTitleChanged = currentTitle !== activePost.value.title;
  const hasBodyChanged = currentBody !== activePost.value.body;

  if (!hasTitleChanged && !hasBodyChanged) {
    sidebarStore.editPost = false;
    return;
  }

  const updatedData = {
    userId: activePost.value.userId,
    title: currentTitle,
    body: currentBody,
  };

  isLoading.value = true;

  try {
    postsStore.updatePost(postsStore.activePostId, updatedData);

    sidebarStore.editPost = false;
  } catch (error) {
    console.error("Error updating post:", error);
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
    <h2>Post editing</h2>

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
            Save
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
  </div>
</template>
