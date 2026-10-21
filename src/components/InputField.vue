<script setup>
const model = defineModel();
const isError = defineModel("isError");

defineProps({
  isComment: {
    type: Boolean,
    default: false,
  },
  isEmail: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="field" data-cy="NameField">
    <label
      class="label"
      :for="
        isEmail
          ? 'comment-author-email'
          : isComment
            ? 'comment-author-name'
            : 'comment-author-name-title'
      "
    >
      {{ isEmail ? "Email" : isComment ? "Author" : "Title" }}
    </label>

    <div class="control has-icons-left has-icons-right">
      <input
        :type="isEmail ? 'email' : 'text'"
        :name="isEmail ? 'email' : isComment ? 'author' : 'title'"
        :id="
          isEmail
            ? 'comment-author-email'
            : isComment
              ? 'comment-author-name'
              : 'comment-author-name-title'
        "
        :placeholder="
          isEmail
            ? 'Your email'
            : isComment
              ? 'Author name'
              : 'Post title'
        "
        class="input"
        :class="{ 'is-danger': isError && (!model || model.length === 0) }"
        v-model="model"
        @input="isError = false"
      />

      <!-- Ícone muda para envelope se for email, ou usuário se for nome/título -->
      <span class="icon is-small is-left">
        <i :class="isEmail ? 'fas fa-envelope' : 'fas fa-user'"></i>
      </span>

      <span
        v-if="isError && (!model || model.length === 0)"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger" data-cy="ErrorMessage">
      {{
        isError && (!model || model.length === 0)
          ? isEmail
            ? "You must provide an email address."
            : isComment
              ? "It is necessary to inform the author"
              : "A title is required"
          : ""
      }}
    </p>
  </div>
</template>
