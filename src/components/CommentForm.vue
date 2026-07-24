<script setup>
import { ref, watch } from "vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import * as commentApi from "../api/comments";
import { isValidEmail } from "../utils/validators.js";

const props = defineProps({
  postId: Number,
  prevComment: null || Object,
});

const emit = defineEmits(["commentAdded", "setWriteComment"]);

const name = ref(props.prevComment?.name || "");
const email = ref(props.prevComment?.email || "");
const body = ref("");

const errors = ref({ name: "", email: "", body: "" });
const isLoading = ref(false);
const commentError = ref("");

watch(
  () => props.prevComment,
  (newComment) => {
    if (newComment) {
      name.value = newComment.name;
    }
  },
);

watch(name, () => {
  errors.value.name = "";
});

watch(email, () => {
  errors.value.email = "";
});

watch(body, () => {
  errors.value.body = "";
});

const validate = () => {
  errors.value = { name: "", email: "", body: "" };
  let isValid = true;

  if (!name.value.trim()) {
    errors.value.name = "Name is required";
    isValid = false;
  }
  if (!body.value.trim()) {
    errors.value.body = "Message cannot be empty";
    isValid = false;
  }
  if (!email.value.trim()) {
    errors.value.email = "Email is required";
    return false;
  }
  if (!isValidEmail(email.value)) {
    errors.value.email = "Please enter a valid email address";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    isLoading.value = true;
    commentError.value = "";

    const newComment = await commentApi.createComment({
      postId: props.postId,
      name: name.value,
      email: email.value,
      body: body.value,
    });

    body.value = "";

    emit("commentAdded", newComment);
    emit("setWriteComment", false);
  } catch (err) {
    commentError.value = "Unable to create a comment";
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  name.value = "";
  email.value = "";
  body.value = "";

  errors.value = { name: "", email: "", body: "" };
  commentError.value = "";
};
</script>

<template>
  <div class="content">
    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="name"
        label="Author Name"
        placeholder="Name Surname"
        icon="user"
        :error="errors.name"
      />

      <InputField
        v-model="email"
        label="Author Email"
        placeholder="Your Email"
        icon="envelope"
        :error="errors.email"
      />

      <TextAreaField
        v-model="body"
        label="Write Comment Body"
        placeholder="Comment"
        :error="errors.body"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isLoading }"
          >
            Add Comment
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="emit('setWriteComment', false)"
          >
            Cancel
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="resetForm"
          >
            Reset
          </button>
        </div>
      </div>

      <p v-if="commentError" class="help is-danger">
        {{ commentError }}
      </p>
    </form>
  </div>
</template>
