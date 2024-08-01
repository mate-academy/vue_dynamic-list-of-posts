<script>
import { createPost } from "@/http-client";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";

export default {
  name: "AddPost",
  props: {
    user: Object,
    addPost: Function,
  },
  data() {
    return {
      title: "",
      body: "",
      errors: {},
    };
  },
  methods: {
    handleSubmit() {
      if (!this.validatePostData()) {
        console.log("Post data not valid");
        console.log("Errors:", this.errors);
        return;
      }

      this.createNewPost();
    },
    clearInputs() {
      this.title = "";
      this.body = "";
    },
    validatePostData() {
      if (!this.title?.length || !this.body?.length) {
        if (!this.title?.length) {
          this.errors.title = "Title is required.";
        }
        if (!this.title?.body) {
          this.errors.body = "Post body is required.";
        }
        return false;
      }
      return true;
    },
    createNewPost() {
      createPost(this.title, this.body, this.user.id)
        .then((response) => {
          this.addPost(response.data);
        })
        .catch((error) => console.log("Error:", error));
    },
  },
  watch: {
    // title() {
    //   console.log(this.title);
    // },
    // body() {
    //   console.log(this.body);
    // },
  },
  components: {
    InputField,
    TextAreaField,
  },
};
</script>

<template>
  <div class="content">
    <h2>Create new post</h2>

    <form @submit.prevent="handleSubmit">
      <InputField v-model="title" />
      <TextAreaField v-model="body" />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>
