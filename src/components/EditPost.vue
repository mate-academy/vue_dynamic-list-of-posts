<script>
import TextAreaField from "./TextAreaField.vue";
import InputField from "./InputField.vue";
import Notification from "./Notification.vue";
import { editPost } from "@/api/posts";

export default {
  name: "EditPost",
  props: {
    post: {
      type: Object,
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
      title: this.post.title,
      body: this.post.body,
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

      editPost({ id: this.post.id, title: this.title, body: this.body })
        .then((newPost) => this.$emit("success", newPost))
        .catch(() => this.errors.message = "Unable to save changes")
        .finally(() => (this.isSubmitting = false));
    },
  },
  watch: {
    title() {
      this.errors.title = null;
    },
    body() {
      this.errors.body = null;
    },
  }
};
</script>

<template>
  <div class="content">
    <h2>Post editing</h2>

    <Notification v-if="errors.message" :errorMessage="errors.message" @close="errors.message = ''"/>

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
