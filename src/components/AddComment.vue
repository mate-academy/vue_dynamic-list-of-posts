<script>
import { createComment } from "@/api/comments";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";

export default {
  name: "AddComment",
  components: {
    InputField,
    TextAreaField,
  },
  emits: ["cancel", "updateCommentsList"],
  props: {
    postId: Number,
  },
  data() {
    return {
      newAuthorName: "",
      newAuthorEmail: "",
      newCommentText: "",
      hasErrorText: false,
      hasErrorName: false,
      hasErrorEmail: false,
      isLoading: false,
    };
  },
  methods: {
    createNewComment() {
      if (!this.validation()) {
        return;
      }

      const newData = {
        body: this.newCommentText,
        email: this.newAuthorEmail,
        name: this.hasErrorName,
        postId: this.postId,
      };

      this.isLoading = true;
      createComment(newData)
        .then(({ data }) => {
          this.newCommentText = "";
          this.$emit("updateCommentsList", data);
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
        });
    },

    cancel() {
      this.$emit("cancel");
    },

    validation() {
      let hasErr = false;

      switch ("") {
        case this.newAuthorName:
          hasErr = true;
          this.hasErrorName = true;

        case this.newAuthorEmail:
          hasErr = true;
          this.hasErrorEmail = true;

        case this.newCommentText:
          hasErr = true;
          this.hasErrorText = true;
          break;

        default:
          hasErr = false;
          break;
      }

      return !hasErr;
    },
  },
};
</script>

<template>
  <form @submit.prevent="createNewComment">
    <InputField
      title="Author Name"
      v-model.trim="newAuthorName"
      :hasError="hasErrorName"
      name="authorName"
      placeholder="Name Surname"
      errorText="Name is required"
      @removeErr="hasErrorName = false"
    />

    <InputField
      title="Author Email"
      v-model.trim="newAuthorEmail"
      :hasError="hasErrorEmail"
      name="authorEmail"
      placeholder="Your Email"
      errorText="Email is required"
      @removeErr="hasErrorEmail = false"
    />

    <TextAreaField
      title="Write Comment Body"
      v-model.trim="newCommentText"
      :hasError="hasErrorText"
      name="commentText"
      placeholder="Comment"
      errorText="Body is required"
      @removeErr="hasErrorText = false"
    />

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': isLoading }"
        >
          Save
        </button>
      </div>
      <div class="control">
        <button
          @click="cancel"
          type="reset"
          class="button is-link is-light"
          :disabled="isLoading"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
