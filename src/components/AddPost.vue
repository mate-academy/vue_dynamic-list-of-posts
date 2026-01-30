<script>
import { createPost } from "../api/posts";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import Notification from "./Notification.vue";

export default {
  name: "AddPost",
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  components: {
    InputField,
    TextAreaField,
    Notification,
  },
  data() {
    return {
      title: "",
      body: "",
      errors: {
        title: null,
        body: null,
        message: "",
      },
      isSubmitting: false,
    };
  },
  methods: {
    handleSubmit() {
      this.errors.title = null;
      this.errors.body = null;

      if (!this.title) {
        this.errors.title = "Title is required";
      }
      if (!this.body) {
        this.errors.body = "Body is required";
      }

      if (this.errors.title || this.errors.body) return;

      this.isSubmitting = true;

      createPost({ title: this.title, body: this.body, userId: this.userId })
        .then((newPost) => this.$emit("success", newPost))
        .catch(() => (this.errors.message = "Failed to create post!"))
        .finally(() => (this.isSubmitting = false));
    },
    clearError() {
      this.errors.message = "";
    },
  },
};
</script>

<template>
  <div class="content">
    <h2>Create new post</h2>
    <Notification
      v-if="errors.message"
      :errorMessage="errors.message"
      @close="clearError"
    />

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="title"
        name="Title"
        label="Title"
        placeholder="Post title"
        :error="errors.title"
      />
      <TextAreaField
        v-model="body"
        name="Body"
        label="Write Post Body"
        placeholder="Post body"
        :error="errors.body"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': isSubmitting }"
          >
            Save
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
