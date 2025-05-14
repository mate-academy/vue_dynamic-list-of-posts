<script>
import { addPost } from "@/api/posts";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
export default {
  name: "PostForm",
  components: {
    InputField,
    TextAreaField,
  },
  props: {
    formName: String,
    userId: Number,
    selectedPost: Object,
  },
  data() {
    return {
      formTitle: "",
      title: "",
      inputError: "",
      body: "",
      bodyError: "",
      userName: "",
    };
  },
  emits: ["closeSidebar", "addPost", "updatePost", "closeEditing"],
  watch: {
    title() {
      this.inputError = "";
    },
    body() {
      this.bodyError = "";
    },
  },
  mounted() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      this.userName = currentUser.name;
    }
    switch (this.formName) {
      case "createPost":
        this.formTitle = "Create new Post";
        break;
      case "editPost":
        this.formTitle = "Post editing";
        this.title = this.selectedPost.title;
        this.body = this.selectedPost.body;
        break;
      default:
        break;
    }
  },
  methods: {
    handleSubmit() {
      const title = this.title.trim();
      const body = this.body.trim();
      const userId = this.userId || this.selectedPost.userId;
      const postId = this.selectedPost.id;
      console.log(title);
      console.log(body);
      console.log(userId);
      console.log(postId);
      if (this.title.length < 3 || this.title.length > 49) {
        this.inputError = "Title must contains from 3 to 49 symbols";
      }
      if (!this.body.length) {
        this.bodyError = "Body can't be empty";
      }
      if (this.inputError.length || this.bodyError.length) {
        return;
      }
      if (this.formName === "createPost") {
        addPost({ userId, title, body }).then(({ data }) => {
          this.$emit("addPost", data);
          this.title = "";
          this.body = "";
        });
      } else {
        this.$emit("updatePost", { postId, title, body });
        this.$emit("closeEditing");
      }
    },
  },
};
</script>

<template>
  <div class="content">
    <h2>{{ formTitle }}</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="title"
        :inputError="inputError"
        :inputName="'postTitle'"
        :userName="userName"
      />

      <TextAreaField
        v-model="body"
        :bodyError="bodyError"
        :bodyName="'postBody'"
        :userName="userName"
      />

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Save</button>
        </div>
        <div class="control" @click="$emit('closeSidebar')">
          <button type="reset" class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>