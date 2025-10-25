<script setup lang="ts">
import { ref, watch } from "vue";
import PostLoader from "./PostLoader.vue";
import type { Comment, CommentInput } from "../types/Comment";
import { CommentsAPI } from "../api/client";

const isSubmitting = ref(false);
const author = ref<string>("");
const email = ref<string>("");
const body = ref<string>("");
const error = ref<string | null>(null);

const props = defineProps<{
  postId: number;
}>();

const emit = defineEmits<{
  close: [];
  commentAdded: [comment: Comment];
}>();

const handleCancel = () => {
  emit("close");
};

const handleClear = () => {
  author.value = "";
  email.value = "";
  body.value = "";
  error.value = null;
};

watch(author, () => {
  if (error.value === "Author is required") {
    error.value = null;
  }
});

watch(email, () => {
  if (error.value === "Email is required") {
    error.value = null;
  }
});

watch(body, () => {
  if (error.value === "Body is required") {
    error.value = null;
  }
});

const addComment = async () => {
  error.value = null;

  if (!author.value.trim()) {
    error.value = "Author is required";
    return;
  }

  if (!email.value.trim()) {
    error.value = "Email is required";
    return;
  }

  if (!body.value.trim()) {
    error.value = "Body is required";
    return;
  }

  isSubmitting.value = true;

  const newComment: CommentInput = {
    postId: props.postId,
    name: author.value.trim(),
    email: email.value.trim(),
    body: body.value.trim(),
  };

  try {
    // Assuming CommentsAPI.addComment returns the created Comment with id
    const createdComment: Comment = await CommentsAPI.addComment(newComment);
    emit("commentAdded", createdComment);

    body.value = ""
  } catch {
    error.value = "Failed to add comment";
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmit = (e: Event) => {
  e.preventDefault();
  addComment();
};
</script>

<template>
  <PostLoader v-if="isSubmitting"></PostLoader>
  <form v-else @submit="handleSubmit">
    <div class="field">
      <label class="label" htmlFor="commentAuthor"> Author name </label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="author"
          type="text"
          id="commentAuthor"
          placeholder="Author name"
          class="input"
          :class="{ 'is-danger': error && !author.trim() }"
          :disabled="isSubmitting"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>

        <span
          v-if="error === 'Author is required'"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p
        v-if="error === 'Author is required'"
        class="help is-danger"
        data-cy="ErrorMessage"
      >
        Author is required
      </p>
    </div>

    <div class="field">
      <label class="label" htmlFor="commentEmail"> Email </label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="email"
          type="email"
          id="commentEmail"
          placeholder="Email"
          class="input"
          :class="{ 'is-danger': error && !email.trim() }"
          :disabled="isSubmitting"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>

        <span
          v-if="error === 'Email is required'"
          class="icon is-small is-right has-text-danger"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p
        v-if="error === 'Email is required'"
        class="help is-danger"
        data-cy="ErrorMessage"
      >
        Email is required
      </p>
    </div>

    <div className="field">
      <label className="label" htmlFor="commentBody"> Text </label>
      <div class="control">
        <textarea
          v-model="body"
          id="commentBody"
          name="commentBody"
          placeholder="Post content"
          class="textarea"
          :class="{ 'is-danger': error && !body.trim() }"
          rows="5"
        ></textarea>
      </div>

      <p v-if="error === 'Body is required'" className="help is-danger">
        Body is required
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-primary"
          :class="{ 'is-loading': isSubmitting }"
        >
          Add comment
        </button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-light"
          @click="handleClear"
          :disabled="isSubmitting"
        >
          Clear
        </button>
      </div>
      <div class="control">
        <button
          type="reset"
          class="button is-primary is-light"
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
