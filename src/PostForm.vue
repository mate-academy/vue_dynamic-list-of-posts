<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          class="input"
          v-model="form.title"
          :class="{ 'is-danger': errors.title }"
          type="text"
          placeholder="Post title"
          required
        />
      </div>
      <p v-if="errors.title" class="help is-danger">{{ errors.title }}</p>
    </div>
    <div class="field">
      <label class="label">Body</label>
      <div class="control">
        <textarea
          class="textarea"
          v-model="form.body"
          :class="{ 'is-danger': errors.body }"
          placeholder="Post body"
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
          {{ mode === "edit" ? "Save" : "Create" }}
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
export default {
  name: "PostForm",
  props: {
    mode: String, // 'create' or 'edit'
    post: Object,
    loading: Boolean,
    error: String,
  },
  data() {
    return {
      form: {
        title: this.post?.title || "",
        body: this.post?.body || "",
      },
      errors: {},
    };
  },
  methods: {
    validate() {
      this.errors = {};
      if (!this.form.title) this.errors.title = "Title is required";
      if (!this.form.body) this.errors.body = "Body is required";
      return Object.keys(this.errors).length === 0;
    },
    handleSubmit() {
      if (this.validate()) {
        this.$emit("submit", { ...this.form });
      }
    },
  },
  watch: {
    "form.title"(val) {
      if (this.errors.title) this.errors.title = "";
    },
    "form.body"(val) {
      if (this.errors.body) this.errors.body = "";
    },
  },
};
</script>
