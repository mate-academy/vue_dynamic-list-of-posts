<template>
  <div class="tile is-child">
    <form @submit.prevent="$emit('submit')">
      <h1 class="title is-3">Create new post</h1>

      <div class="field">
        <label class="label" for="title"> Title </label>

        <div class="control has-icons-left">
          <input
            type="text"
            id="title"
            name="title"
            class="input"
            placeholder="Post title"
            :value="title"
            :class="{ 'is-danger': errorTitle }"
            @input="$emit('title-input', $event)"
          />

          <span v-if="errorTitle" class="icon is-small right has-text-danger"
            ><i class="fas fa-exclamation-triangle"></i
          ></span>

          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        </div>

        <p v-if="errorTitle" class="help is-danger">
          {{ errorTitle }}
        </p>
      </div>

      <p class="help is-danger" v-if="errorWriteComment">
        {{ errorWriteComment }}
      </p>

      <div class="field" data-cy="BodyField">
        <label class="label" for="post-body">
          Write Post Body
        </label>
        <div class="control">
          <textarea
            id="post-body"
            name="name"
            placeholder="Post body"
            class="textarea"
            :value="body"
            :class="{ 'is-danger': errorBody }"
            @input="$emit('body-input', $event)"
          ></textarea>
        </div>

        <p v-if="errorBody" class="help is-danger" data-cy="ErrorMessage">
          {{ errorBody }}
        </p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link"
            :class="{ 'is-loading': loadingWriteComment }"
            :disabled="loadingWriteComment"
          >
            {{ loadingWriteComment ? "" : "Create post" }}
          </button>
        </div>

        <div class="control">
          <button
            type="reset"
            @click="$emit('cancel')"
            class="button is-link is-light"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  body: String,
  errorTitle: String,
  errorBody: String,
  loadingWriteComment: Boolean,
  errorWriteComment: String,
});

defineEmits(["submit", "cancel", "title-input", "body-input"]);
</script>

<style scoped>
.right {
  right: 0;
}
</style>