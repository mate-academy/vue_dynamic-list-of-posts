<script setup>
import { reactive } from "vue";
import Input from "./Input.vue";
import TextAreaField from "./TextAreaField.vue";
import {
  COMMENT_BODY_ERROR,
  COMMENT_BODY_PLACEHOLDER,
  COMMENT_EMAIL_ERROR,
  COMMENT_EMAIL_PLACEHOLDER,
  COMMENT_NAME_ERROR,
  COMMENT_NAME_PLACEHOLDER,
} from "@/const";

defineProps({
  isCommentCreating: Boolean,
});

const formData = reactive({
  name: "",
  email: "",
  body: "",
  nameError: "",
  emailError: "",
  bodyError: "",
});

const emit = defineEmits(["cancel", "create"]);

const formAction = () => {
  const { name, email, body } = formData;
  if (!name) {
    formData.nameError = COMMENT_NAME_ERROR;
  } else if (!body) {
    formData.bodyError = COMMENT_BODY_ERROR;
  } else if (!email || !email.includes("@")) {
    formData.emailError = COMMENT_EMAIL_ERROR;
  } else {
    emit("create", formData);
  }
};
</script>
<template>
  <div class="content">
    <form
      @submit.prevent="formAction"
      @reset="emit('cancel', isCommentCreating)"
    >
      <Input
        :placeholder="COMMENT_NAME_PLACEHOLDER"
        label="Author Name"
        v-model="formData.name"
        name="name"
        :error="formData.nameError"
        type="text"
      />
      <Input
        :placeholder="COMMENT_EMAIL_PLACEHOLDER"
        label="Author Email"
        v-model="formData.email"
        name="email"
        :error="formData.emailError"
        type="email"
      />
      <TextAreaField
        :placeholder="COMMENT_BODY_PLACEHOLDER"
        label="Write Comment Body"
        v-model="formData.body"
        name="body"
        :error="formData.bodyError"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Add comment</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>
