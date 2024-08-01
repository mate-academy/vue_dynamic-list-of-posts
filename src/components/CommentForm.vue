<script>
import { createComment } from "@/api/comments";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";

export default {
  name: "CommentForm",
  props: {
    modelValue: Boolean,
    postId: Number,
    addComment: Function,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      name: "",
      email: "",
      body: "",

      errors: {
        name: "",
        email: "",
        body: "",
      },
    };
  },
  methods: {
    handleCreateComment() {
      console.log("Entered handleCreateComment");

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
    validateEmail(email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },
    validateCommentData() {
      console.log("Started validation");
      if (
        !this.name?.length ||
        !this.validateEmail(this.email) ||
        !this.email?.length ||
        !this.body?.length
      ) {
        if (!this.name?.length) {
          this.errors.name = "Name and Surname are required.";
        }

        if (!this.validateEmail(this.email)) {
          this.errors.email = "Email is invalid.";
        } else if (!this.email?.length) {
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
    },

    clearErrorByField(field) {
      console.log(`Clearing ${field} error`);
      if (field in this.errors) {
        this.errors[field] = "";
      }
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
      <InputField
        v-model="name"
        :error="this.errors.name"
        name="name"
        :clearErrorByField="clearErrorByField"
      />
      <InputField
        v-model="email"
        :error="this.errors.email"
        name="email"
        :clearErrorByField="clearErrorByField"
      />
      <TextAreaField
        v-model="body"
        :error="this.errors.body"
        name="body"
        :clearErrorByField="clearErrorByField"
      />

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
