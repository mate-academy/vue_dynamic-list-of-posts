<script>
import { createPost, patchPost } from "@/api/posts";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";

export default {
  name: "AddPost",
  props: {
    modelValue: Boolean,
    user: Object,
    addPost: Function,
    isEditing: Boolean,
    editPost: Function,
    post: Object || null,
    cancelEditing: Function,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      title: "",
      body: "",
      errors: {
        title: "",
        body: "",
      },
      isSendingRequest: false,
    };
  },
  methods: {
    handleUpdatePost() {
      if (!this.validatePostData()) {
        return;
      }
      this.updatePost();
    },
    handleCreatePost() {
      if (!this.validatePostData()) {
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
      this.isSendingRequest = true;

      createPost(this.title, this.body, this.user.id)
        .then((response) => {
          this.addPost(response.data);
        })
        .catch(() => console.log("Could not add the post"))
        .finally(() => {
          this.isSendingRequest = false;
        });
    },
    updatePost() {
      this.isSendingRequest = true;

      patchPost(this.post.id, this.title, this.body)
        .then((response) => {
          this.editPost(response.data);
        })
        .catch(() => console.log("Could not update the post"))
        .finally(() => {
          this.isSendingRequest = false;
        });
    },
    clearErrorByField(field) {
      if (field in this.errors) {
        this.errors[field] = "";
      }
    },
    clearErrors() {
      this.errors.body = "";
      this.errors.title = "";
    },
    clearFields() {
      this.body = "";
      this.title = "";
    },
    handleCancel() {
      this.$emit("update:modelValue", false);
      this.clearErrors();
      this.clearFields();
      this.cancelEditing();
    },
  },
  watch: {},
  components: {
    InputField,
    TextAreaField,
  },
};
</script>

<template>
  <div class="content">
    <h2>{{ this.isEditing ? "Update post" : "Create new post" }}</h2>

    <form>
      <InputField
        :error="this.errors.title"
        v-model="title"
        name="title"
        :clearErrorByField="clearErrorByField"
      />
      <TextAreaField
        :error="this.errors.body"
        v-model="body"
        name="body"
        :clearErrorByField="clearErrorByField"
      />

      <div class="field is-grouped">
        <div class="control">
          <button
            @click.prevent="handleUpdatePost"
            v-if="this.isEditing"
            type="submit"
            class="button is-link"
            :class="isSendingRequest ? 'is-loading' : ''"
          >
            Save
          </button>
          <button
            @click.prevent="handleCreatePost"
            v-else="true"
            type="submit"
            class="button is-link"
            :class="isSendingRequest ? 'is-loading' : ''"
          >
            Create
          </button>
        </div>
        <div class="control">
          <button
            @click="handleCancel"
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
