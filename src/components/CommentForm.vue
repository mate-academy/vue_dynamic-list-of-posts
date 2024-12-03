<script>
export default {
  name: "CommentForm",
  props: {
    currentPostId: {
      type: Number,
      required: true,
    },
  },
  emits: ["toggleVisibility", "submitComment"],
  data() {
    return {
      authorName: "",
      authorEmail: "",
      commentText: "",
      errorName: "",
      errorEmail: "",
      errorText: "",
    };
  },
  methods: {
    validateInputs() {
      let hasError = false;
      this.resetErrors();

      if (!this.authorName) {
        this.errorName = "Name is required";
        hasError = true;
      }
      if (!this.authorEmail) {
        this.errorEmail = "Email is required";
        hasError = true;
      } else if (!/\S+@\S+\.\S+/.test(this.authorEmail)) {
        this.errorEmail = "Invalid email format";
        hasError = true;
      }
      if (!this.commentText) {
        this.errorText = "Comment text is required";
        hasError = true;
      }

      return hasError;
    },
    submitForm() {
      if (!this.validateInputs()) {
        this.$emit("submitComment", {
          name: this.authorName,
          email: this.authorEmail,
          body: this.commentText,
        });
        this.resetForm();
      }
    },
    resetForm() {
      this.authorName = "";
      this.authorEmail = "";
      this.commentText = "";
      this.resetErrors();
      this.$emit("toggleVisibility");
    },
    resetErrors() {
      this.errorName = "";
      this.errorEmail = "";
      this.errorText = "";
    },
  },
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="field" data-cy="NameField">
      <label class="label" :for="`author-name`">Author Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          id="author-name"
          class="input"
          :class="{ 'is-danger': errorName }"
          type="text"
          placeholder="Your Name"
          v-model="authorName"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span v-if="errorName" class="icon is-small is-right has-text-danger">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errorName" class="help is-danger">{{ errorName }}</p>
    </div>

    <div class="field" data-cy="EmailField">
      <label class="label" :for="`author-email`">Author Email</label>
      <div class="control has-icons-left has-icons-right">
        <input
          id="author-email"
          class="input"
          :class="{ 'is-danger': errorEmail }"
          type="email"
          placeholder="Your Email"
          v-model="authorEmail"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span v-if="errorEmail" class="icon is-small is-right has-text-danger">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p v-if="errorEmail" class="help is-danger">{{ errorEmail }}</p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" :for="`comment-text`">Comment</label>
      <div class="control">
        <textarea
          id="comment-text"
          class="textarea"
          :class="{ 'is-danger': errorText }"
          placeholder="Write your comment"
          v-model="commentText"
        ></textarea>
      </div>
      <p v-if="errorText" class="help is-danger">{{ errorText }}</p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">Save</button>
      </div>
      <div class="control">
        <button type="button" class="button is-link is-light" @click="resetForm">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
