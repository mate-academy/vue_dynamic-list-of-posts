<script>
import { addUserPost } from "../api/usersData";

export default {
  name: "textAreaField",
  props: {
    currentUserId: {
      type: String,
      required: true,
    },
    editing: {
      type: Boolean,
      default: false,
    },
    post: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      title: this.post?.title || "",
      body: this.post?.body || "",
      isTitleError: false,
      isBodyError: false,
    };
  },
  methods: {
    validateInput() {
      this.isTitleError = !this.title.trim();
    },
    validateBody() {
      this.isBodyError = !this.body.trim();
    },
    generatePostId() {
      return Math.floor(1000 + Math.random() * 9000).toString();
    },
    handleSubmit(event) {
      event.preventDefault();
      this.validateInput();
      this.validateBody();

      if (!this.isTitleError && !this.isBodyError) {
        const newPost = {
          id: this.editing ? this.post.id : this.generatePostId(),
          title: this.title.trim(),
          body: this.body.trim(),
        };

        if (this.editing) {
          this.$emit("update-post", newPost);
        } else {
          this.$emit("new-post", newPost);
        }

        if (!this.editing) {
          addUserPost(this.currentUserId, newPost);
        }

        this.resetForm();
      }
    },
    resetForm() {
      this.title = "";
      this.body = "";
      this.isTitleError = false;
      this.isBodyError = false;
    },
    handleCancel() {
      this.resetForm();
      this.$emit("cancel");
    },
  },
  watch: {
    post: {
      immediate: true,
      handler(newPost) {
        if (this.editing && newPost) {
          this.title = newPost.title || "";
          this.body = newPost.body || "";
        } else {
          this.resetForm();
        }
      },
    },
  },
};
</script>

<template>
  <div class="tile is-child box is-success">
    <p class="title">{{ editing ? "Edit post" : "Create new post" }}</p>
    <form @submit="handleSubmit">
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-title">Title</label>
        <div class="control has-icons-left has-icons-right">
          <input
            v-model="title"
            @input="validateInput"
            type="text"
            name="title"
            id="comment-author-name-title"
            placeholder="Post title"
            class="input"
            :class="{ 'is-danger': isTitleError }"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user fa-heading"></i>
          </span>
          <span
            v-if="isTitleError"
            class="icon is-small is-right has-text-danger"
            data-cy="ErrorIcon"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>
        <p v-if="isTitleError" class="help is-danger" data-cy="ErrorMessage">
          Title is required
        </p>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body">Write Post Body</label>
        <div class="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Post body"
            class="textarea"
            :class="{ 'is-danger': isBodyError }"
            v-model="body"
            @input="validateBody"
          ></textarea>
        </div>
        <p v-if="isBodyError" class="help is-danger" data-cy="ErrorMessage">
          Body is required
        </p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :disabled="isBodyError || isTitleError"
          >
            {{ editing ? "Update" : "Save" }}
          </button>
        </div>
        <div class="control">
          <button
            type="reset"
            class="button is-link is-light"
            @click="handleCancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.input.is-danger,
.textarea.is-danger {
  border-color: #ff3860;
}
.help.is-danger {
  color: #ff3860;
}
</style>
