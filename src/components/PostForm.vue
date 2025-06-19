<script setup lang="ts">
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import { addNewPost, updatePost } from "../api/posts";
import { defineProps, defineEmits, ref, watch } from "vue";

const emit = defineEmits(["addPost", "closeSidebar", "updatePost", "onEdit"]);

const { selectedPost } = defineProps(["selectedPost"]);

const title = ref(selectedPost?.title || "");
const postBody = ref(selectedPost?.body || "");
const user = localStorage.getItem("user");
const userId = user ? JSON.parse(user).id : null;
const titleError = ref("");
const bodyError = ref("");

const handleRestore = () => {
  title.value = "";
  postBody.value = "";
  if (selectedPost) {
    emit("onEdit");
  } else {
    emit("closeSidebar");
  }
};

const clearForm = () => {
  title.value = "";
  postBody.value = "";
  titleError.value = "";
  bodyError.value = "";
};

const handleSave = async () => {
  let error = false;
  if (!title.value) {
    titleError.value = "Title is required";
    error = true;
  }
  if (!postBody.value) {
    bodyError.value = "Body is required";
    error = true;
  }
  if (error) {
    error = false;
    return;
  }
  if (selectedPost) {
    updatePost({ ...selectedPost, title: title.value, body: postBody.value })
      .then((res) => {
        emit("updatePost", res.data);
        clearForm();
      })
      .catch((err) => {
        console.error("Error updating post:", err);
        throw err;
      });
  } else {
    addNewPost({ userId, title: title.value, body: postBody.value })
      .then((res) => {
        emit("addPost", res.data);
        clearForm();
      })
      .catch((err) => {
        console.error("Error adding post:", err);
        throw err;
      });
  }
};

watch(title, (val) => {
  if (val) titleError.value = "";
});

watch(postBody, (val) => {
  if (val) bodyError.value = "";
});
</script>

<template>
  <div class="content">
    <h2>{{ selectedPost ? "Post editing" : "Create new post" }}</h2>

    <form @submit.prevent="handleSave">
      <InputField
        :title="'Title'"
        :error="titleError"
        v-model="title"
        :placeholder="'Post title'"
      />
      <TextAreaField
        :title="'Write Post Body'"
        :error="bodyError"
        v-model="postBody"
        :placeholder="'Post body'"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">
            {{ selectedPost ? "Save" : "Create" }}
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            @click="handleRestore"
            class="button is-link is-light"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
