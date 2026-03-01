<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { PostComment } from "../types/Comment";
import { createComment } from "../api/comments";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";

type Props = {
  postId: number;
  initialName?: string;
  initialEmail?: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "submitted", comment: PostComment): void;
  (e: "saved-author", payload: { name: string; email: string }): void;
  (e: "cancel"): void;
}>();

const form = reactive({
  name: props.initialName ?? "",
  email: props.initialEmail ?? "",
  body: "",
});

const isSubmitting = ref(false);
const submitAttempted = ref(false);
const submitError = ref<string | null>(null);

watch(
  () => props.postId,
  () => {
    form.body = "";
    submitAttempted.value = false;
    submitError.value = null;
  },
);

const errors = computed(() => {
  const e: Record<"name" | "email" | "body", string | null> = {
    name: null,
    email: null,
    body: null,
  };

  if (!form.name.trim()) e.name = "Name is required";
  if (!form.email.trim()) e.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
    e.email = "Email is not valid";
  if (!form.body.trim()) e.body = "Comment text is required";

  return e;
});

const hasErrors = computed(() =>
  Boolean(errors.value.name || errors.value.email || errors.value.body),
);

function onFieldInput() {
  if (submitAttempted.value) {
    submitError.value = null;
  }
}

function clear() {
  submitAttempted.value = false;
  submitError.value = null;

  form.body = "";
}

async function submit() {
  submitAttempted.value = true;
  submitError.value = null;

  if (hasErrors.value) return;

  isSubmitting.value = true;

  try {
    const created = await createComment({
      postId: props.postId,
      name: form.name.trim(),
      email: form.email.trim(),
      body: form.body.trim(),
    });

    emit("submitted", created);
    emit("saved-author", { name: form.name.trim(), email: form.email.trim() });
    form.body = "";
    submitAttempted.value = false;
  } catch (e) {
    submitError.value =
      e instanceof Error ? e.message : "Failed to add comment";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="box mt-3">
    <h5 class="title is-5">
      New comment
    </h5>

    <div
      v-if="submitError"
      class="notification is-danger"
    >
      {{ submitError }}
    </div>

    <InputField
      v-model="form.name"
      cy="NameField"
      name="name"
      label="Name"
      placeholder="Enter your name"
      :error="submitAttempted ? errors.name : null"
      @update:model-value="onFieldInput"
    />

    <InputField
      v-model="form.email"
      cy="EmailField"
      name="email"
      label="Email"
      placeholder="Enter your email"
      :error="submitAttempted ? errors.email : null"
      @update:model-value="onFieldInput"
    />

    <TextAreaField
      v-model="form.body"
      cy="BodyField"
      name="body"
      label="Comment"
      placeholder="Type your comment"
      :rows="4"
      :error="submitAttempted ? errors.body : null"
      @update:model-value="onFieldInput"
    />

    <div class="buttons">
      <button
        class="button is-link"
        :class="{ 'is-loading': isSubmitting }"
        type="button"
        @click="submit"
      >
        Add
      </button>

      <button
        class="button"
        type="button"
        @click="clear"
      >
        Clear
      </button>

      <button
        class="button is-light"
        type="button"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
