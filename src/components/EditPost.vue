<script setup>
import { ref, watch } from "vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import * as postApi from "../api/posts";

const props = defineProps({
  user: Object,
  post: Object,
});

const emit = defineEmits(["setEditPost", "postUpdated"]);

const title = ref(props.post.title);
const body = ref(props.post.body);
const errors = ref({ title: "", body: "" });
const isLoading = ref(false);
const postError = ref("");

watch(title, () => {
  errors.value.title = "";
});

watch(body, () => {
  errors.value.body = "";
});

const validate = () => {
  errors.value = { title: "", body: "" };
  let isValid = true;

  if (!title.value.trim()) {
    errors.value.title = "Title is required";
    isValid = false;
  }

  if (!body.value.trim()) {
    errors.value.body = "Body is required";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    isLoading.value = true;
    postError.value = "";

    const updatePost = await postApi.updatePost(props.post.id, {
      title: title.value,
      userId: props.user.id,
      body: body.value,
    });

    emit("postUpdated", updatePost);
    emit("setEditPost", false);
  } catch (err) {
    postError.value = "Unable to update a post";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="content">
    <h2>Post editing</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="title"
        label="Title"
        placeholder="Post title"
        icon="user"
        :error="errors.title"
      />

      <TextAreaField
        v-model="body"
        label="Write Post Body"
        placeholder="Post Body"
        :error="errors.body"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isLoading }"
          >
            Save
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="emit('setEditPost', false)"
          >
            Cancel
          </button>
        </div>
      </div>

      <p v-if="postError" class="help is-danger">
        {{ postError }}
      </p>
    </form>
  </div>
</template>
