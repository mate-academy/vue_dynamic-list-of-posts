<template>
  <form @submit.prevent="$emit('submit')" @reset.prevent="$emit('cancel')">
    <div class="field">
      <label class="label" for="comment-author-name-name">Author Name</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="name"
          placeholder="Name Surname"
          class="input"
          :value="authorName"
          :class="{ 'is-danger': errorMessageAuthorName }"
          @input="$emit('name-input', $event)"
        /><span class="icon is-small is-left"
          ><i class="fas fa-user fa-user"></i
        ></span>

        <span
          v-if="errorMessageAuthorName"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
          ><i class="fas fa-exclamation-triangle"></i
        ></span>

        <p v-if="errorMessageAuthorName" class="help is-danger">
          {{ errorMessageAuthorName }}
        </p>
      </div>
    </div>
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name-email">Author Email</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          class="input"
          :value="authorEmail"
          @input="$emit('email-input', $event)"
          :class="{ 'is-danger': errorMessageAuthorEmail }"
        />

        <span class="icon is-small is-left">
          <i class="fas fa-user fa-envelope"> </i>
        </span>

        <span
          v-if="errorMessageAuthorEmail"
          class="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
          ><i class="fas fa-exclamation-triangle"></i
        ></span>

        <p v-if="errorMessageAuthorEmail" class="help is-danger">
          {{ errorMessageAuthorEmail }}
        </p>
      </div>
    </div>
    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Write Post Body</label>
      <div class="control">
        <textarea
          :value="authorBody"
          @input="$emit('body-input', $event)"
          name="body"
          placeholder="Comment"
          class="textarea"
          :class="{ 'is-danger': errorMessageAuthorBody }"
        ></textarea>
      </div>

      <p v-if="errorMessageAuthorBody" class="help is-danger">
        {{ errorMessageAuthorBody }}
      </p>

      <p v-if="commentWriteError" class="help is-danger">
        {{ commentWriteError }}
      </p>

      <p v-if="errorMessageDeletePost" class="help is-danger">
        {{ errorMessageDeletePost }}
      </p>

      <p v-if="errorMessageEditPost" class="help is-danger">
        {{ errorMessageEditPost }}
      </p>

      <p v-if="errorMessageDeleteComment" class="help is-danger">
        {{ errorMessageDeleteComment }}
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button
          type="submit"
          class="button is-link"
          :class="{ 'is-loading': loadingAddComment }"
          :disabled="loadingAddComment"
        >
          {{ loadingAddComment ? "" : "Add Comment" }}
        </button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light">Cancel</button>
      </div>
    </div>
  </form>
</template>

<script setup>
defineProps({
  authorName: String,
  authorEmail: String,
  authorBody: String,
  errorMessageAuthorName: String,
  errorMessageAuthorEmail: String,
  errorMessageAuthorBody: String,
  commentWriteError: String,
  errorMessageDeletePost: String,
  errorMessageEditPost: String,
  errorMessageDeleteComment: String,
  loadingAddComment: Boolean,
});

defineEmits(["submit", "cancel", "name-input", "email-input", "body-input"]);
</script>