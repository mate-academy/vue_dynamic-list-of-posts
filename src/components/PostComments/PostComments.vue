<script>
import CommentBody from "../CommentBody/CommentBody";

export default {
  data() {
    return {
      isUpdateComment: false,
      postId: this.post.id,
      name: "",
      email: "",
      body: "",
      errorText: "",
    };
  },

  components: {
    CommentBody,
  },

  inject: ["removeComment"],
  provide() {
    return {
      removeComment: this.removeComment,
    };
  },

  methods: {
    removePost() {
      const postId = this.post.id;
      this.$emit("handleRemovePost", postId);
    },

    addComment() {
      let newComment = {
        postId: this.postId,
        name: this.name,
        email: this.email,
        body: this.body,
      };

      this.$emit("handleAddComment", newComment);
      this.toggleAddComment();
      (this.postId = this.post.id), (this.name = "");
      this.email = "";
      this.body = "";
    },

    toggleAddComment() {
      this.isUpdateComment = !this.isUpdateComment;
    },

    toggleEditPost() {
      this.$emit("editPost");
    },
  },
  props: {
    post: Object,
    comments: Array,
    handleRemoveComment: Function,
  },
};
</script>

<template>
  <div className="tile is-child box is-success">
    <div className="block">
      <div
        className="is-flex is-justify-content-space-between is-align-items-center"
      >
        <h2>#{{ post.id }}: {{ post.title }}</h2>
        <div className="is-flex">
          <span className="icon is-small is-right is-clickable">
            <i className="fas fa-pen-to-square" @click="toggleEditPost"></i>
          </span>
          <span
            className="icon is-small is-right has-text-danger is-clickable ml-3"
          >
            <i className="fas fa-trash" @click="removePost"></i>
          </span>
        </div>
      </div>
      <p data-cy="PostBody">{{ post.body }}</p>
    </div>

    <article className="message is-small" v-if="comments.length > 0">
      <CommentBody
        v-for="comment of this.comments"
        :key="comment.postId"
        :comment="comment"
        v-on:handleRemoveComment="handleRemoveComment"
      />
    </article>
    <div className="block" v-else>
      <p className="title is-4">No comments yet</p>
    </div>
    <button
      type="button"
      className="button is-link"
      v-if="!isUpdateComment"
      @click="toggleAddComment"
    >
      Write a comment
    </button>

    <div className="field" data-cy="BodyField" v-else>
      <label className="label" htmlFor="{`comment-author-name-${name}`}">
        Author Name
      </label>
      <div className="control has-icons-left has-icons-right">
        <input
          v-model="name"
          type="text"
          name="{name}"
          id="{`comment-author-name-${name}`}"
          placeholder="Name Surmane"
          class="input"
          :class="{ 'is-danger': errorText }"
        />
        <span className="icon is-small is-left">
          <i className="fas fa-user"></i>
        </span>

        <span
          className="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
          v-if="errorText"
        >
          <i className="fas fa-exclamation-triangle"></i>
        </span>
      </div>

      <p className="help is-danger" data-cy="ErrorMessage" v-if="errorText">
        error text
      </p>

      <label className="label" htmlFor="user-email"> Author Email </label>

      <div className="control has-icons-left">
        <input
          v-model="email"
          type="email"
          id="user-email"
          name="email"
          class="input"
          placeholder="Your Email"
          :class="{ 'is-danger': errorText }"
          required
        />

        <span className="icon is-small is-left">
          <i className="fas fa-envelope" />
        </span>
      </div>

      <p v-if="errorText" className="help is-danger">error message</p>

      <label className="label" htmlFor="{`comment-${name}`}">
        Write Post Body
      </label>
      <div className="control">
        <textarea
          v-model="body"
          id="{`comment-${name}`}"
          name="name"
          placeholder="Comment"
          class="textarea"
          :class="{ 'is-danger': errorText }"
        ></textarea>
      </div>

      <p className="help is-danger" data-cy="ErrorMessage" v-if="errorText">
        error text
      </p>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className="button is-link"
            @click="addComment()"
          >
            Add Comment
          </button>
        </div>
        <div className="control">
          <button
            type="reset"
            className="button is-link is-light"
            @click="toggleAddComment"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
