<script setup>
import { reactive, ref, watch } from "vue";
import FormInput from "../FormInput.vue";
import FormTextarea from "../FormTextarea.vue";
import { createComment } from "../../api/posts.js";

const props = defineProps({
  postId: { type: [Number, String], required: true },
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emit = defineEmits(["created", "cancel"]);

const name = ref("");
const email = ref("");
const body = ref("");

const errors = reactive({ name: "", email: "", body: "" });
const isSubmitting = ref(false);
const submitError = ref("");

watch(name, () => {
  errors.name = "";
});
watch(email, () => {
  errors.email = "";
});
watch(body, () => {
  errors.body = "";
});

const validate = () => {
  const emailValue = email.value.trim();

  errors.name = name.value.trim() ? "" : "Name is required";
  errors.body = body.value.trim() ? "" : "Comment text is required";

  if (!emailValue) {
    errors.email = "Email is required";
  } else if (!EMAIL_PATTERN.test(emailValue)) {
    errors.email = "Enter a valid email address";
  } else {
    errors.email = "";
  }

  return !errors.name && !errors.email && !errors.body;
};

const handleSubmit = async () => {
  submitError.value = "";

  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  let comment;

  try {
    comment = await createComment({
      postId: props.postId,
      name: name.value.trim(),
      email: email.value.trim(),
      body: body.value.trim(),
    });
  } catch (error) {
    console.error(error);
    submitError.value = "Failed to add the comment. Please try again.";
    isSubmitting.value = false;
    return;
  }

  isSubmitting.value = false;
  body.value = "";
  emit("created", comment);
};

const handleClear = () => {
  name.value = "";
  email.value = "";
  body.value = "";
  errors.name = "";
  errors.email = "";
  errors.body = "";
};
</script>

<template>
  <form data-cy="NewCommentForm" novalidate @submit.prevent="handleSubmit">
    <FormInput
      v-model="name"
      title="Name"
      name="name"
      placeholder="Name Surname"
      :error="errors.name"
    />

    <FormInput
      v-model="email"
      title="Email"
      name="email"
      type="email"
      icon="fa-envelope"
      data-cy="EmailField"
      placeholder="email@test.com"
      :error="errors.email"
    />

    <FormTextarea
      v-model="body"
      title="Comment"
      name="body"
      placeholder="Type comment here"
      :error="errors.body"
    />

    <p v-if="submitError" class="help is-danger mb-3">
      {{ submitError }}
    </p>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isSubmitting }"
          :disabled="isSubmitting"
        >
          Save
        </button>
      </div>

      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          :disabled="isSubmitting"
          @click="emit('cancel')"
        >
          Cancel
        </button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          :disabled="isSubmitting"
          @click="handleClear"
        >
          Clear
        </button>
      </div>
    </div>
  </form>
</template>
