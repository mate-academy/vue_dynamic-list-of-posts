<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input"
          v-model="form.name"
          :class="{ 'is-danger': errors.name }"
          type="text"
          placeholder="Your name"
          required
        />
      </div>
      <p v-if="errors.name" class="help is-danger">
        {{ errors.name }}
      </p>
    </div>
    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input
          class="input"
          v-model="form.email"
          :class="{ 'is-danger': errors.email }"
          type="email"
          placeholder="Your email"
          required
        />
      </div>
      <p v-if="errors.email" class="help is-danger">
        {{ errors.email }}
      </p>
    </div>
    <div class="field">
      <label class="label">Comment</label>
      <div class="control">
        <textarea
          class="textarea"
          v-model="form.body"
          :class="{ 'is-danger': errors.body }"
          placeholder="Write your comment"
          required
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button
          class="button is-link"
          :class="{ 'is-loading': loading }"
          type="submit"
        >
          Submit
        </button>
      </div>
      <div class="control">
        <button class="button is-light" type="button" @click="handleClear">
          Clear
        </button>
      </div>
      <div class="control">
        <button class="button is-light" type="button" @click="$emit('cancel')">
          Cancel
        </button>
      </div>
    </div>
    <p v-if="error" class="help is-danger">{{ error }}</p>
  </form>
</template>

<script>
import { addComment } from "./api.js";
export default {
  name: "CommentForm",
  props: {
    postId: Number,
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        body: "",
      },
      errors: {},
      loading: false,
      error: "",
    };
  },
  methods: {
    validate() {
      this.errors = {};
      if (!this.form.name) this.errors.name = "Name is required";
      if (!this.form.email) this.errors.email = "Email is required";
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.form.email))
        this.errors.email = "Invalid email";
      if (!this.form.body) this.errors.body = "Comment is required";
      return Object.keys(this.errors).length === 0;
    },
    async handleSubmit() {
      if (!this.validate()) return;
      this.loading = true;
      this.error = "";
      try {
        const newComment = await addComment(this.postId, {
          name: this.form.name,
          email: this.form.email,
          body: this.form.body,
        });
        this.$emit("submitted", newComment);
        // Keep name/email, clear only comment body
        this.form.body = "";
        this.errors.body = "";
      } catch (err) {
        this.error = err.message || "Failed to add comment";
      } finally {
        this.loading = false;
      }
    },
    handleClear() {
      this.form.name = "";
      this.form.email = "";
      this.form.body = "";
      this.errors = {};
      this.error = "";
    },
  },
  watch: {
    "form.name"(val) {
      if (this.errors.name) this.errors.name = "";
    },
    "form.email"(val) {
      if (this.errors.email) this.errors.email = "";
    },
    "form.body"(val) {
      if (this.errors.body) this.errors.body = "";
    },
  },
};
</script>
