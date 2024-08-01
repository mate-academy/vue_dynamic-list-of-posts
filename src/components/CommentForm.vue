<script>
import { createComment } from "@/http-client";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";

export default {
  name: "CommentForm",
  props: {
    modelValue: Boolean,
    postId: Number,
    addComment: Function,
    // isEditing: Boolean,
    // editPost: Function,
    // post: Object || null,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      name: "",
      email: "",
      body: "",
      errors: {},
    };
  },
  methods: {
    handleCreateComment() {
      if (!this.validateCommentData()) {
        console.log("Comment data not valid");
        console.log("Errors:", this.errors);
        return;
      }

      this.createNewComment();
    },
    clearInputs() {
      this.name = "";
      this.email = "";
      this.body = "";
    },
    validateCommentData() {
      if (!this.name?.length || !this.email?.length || !this.body?.length) {
        if (!this.name?.length) {
          this.errors.name = "Name and Surname are required.";
        }
        if (!this.email?.length) {
          this.errors.email = "Email is required.";
        }
        if (!this.body?.length) {
          this.errors.body = "Comment body is required.";
        }
        return false;
      }
      return true;
    },

    closeCommentForm() {
      this.$emit("update:modelValue", false);
    },

    createNewComment() {
      createComment(this.postId, this.name, this.email, this.body)
        .then((response) => {
          this.addComment(response.data);
          console.log("close comment form");
          this.closeCommentForm();
        })
        .catch((error) => console.log("Error:", error));
      // Finally is adding post = false - Mayve dodać stan ???
    },
  },
  watch: {
    name() {
      console.log("name:", this.name);
    },
    email() {
      console.log("email:", this.email);
    },
    body() {
      console.log("body:", this.body);
    },
  },
  components: {
    InputField,
    TextAreaField,
  },
};
</script>

<template>
  <div class="content">
    <form>
      <InputField v-model="name" />
      <InputField v-model="email" />
      <TextAreaField v-model="body" />

      <div class="field is-grouped">
        <div class="control">
          <button @click.prevent="handleCreateComment" class="button is-link">
            Create
          </button>
        </div>
        <div class="control">
          <button
            @click="this.closeCommentForm"
            type="reset"
            class="button is-link is-light"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
