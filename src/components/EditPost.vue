<script setup lang="ts">
import type { Post } from "@/assets/types/Post";
import { ref } from "vue";

const props = defineProps<{
  post: Post | null;
  handleClose: () => void;
  handleUpdatePost: (title: string, body: string) => void;
}>();

const title = ref(props.post ? props.post.title : "");
const body = ref(props.post ? props.post.body : "");

const titleError = ref(false);
const bodyError = ref(false);

const handleValidate = () => {
  if (title.value.length <= 0) {
    titleError.value = true;
  }
  if (body.value.length <= 0) {
    bodyError.value = true;
  }

  if (!titleError.value && !bodyError.value) {
    props.handleUpdatePost(title.value, body.value);
  }
};

const handleCancel = () => {
  title.value = "";
  body.value = "";
  titleError.value = false;
  bodyError.value = false;
  props.handleClose();
};

const handleResetErrors = () => {
  titleError.value = false;
  bodyError.value = false;
};
</script>

<template>
  <div class="tile is-child box is-success flex-itemDown">
    <div class="content">
      <h2>Post editing</h2>

      <form @submit.prevent="handleValidate">
        <div class="field">
          <label class="label" for="post-title"> Title </label>
          <div class="control has-icons-left has-icons-right">
            <input
              type="text"
              name="title"
              id="post-title"
              placeholder="Post title"
              v-model="title"
              class="input"
              :class="{ 'is-danger': titleError }"
              @input="handleResetErrors"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user" />
            </span>

            <span
              class="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
              v-if="titleError"
            >
              <i class="fas fa-exclamation-triangle" />
            </span>
          </div>

          <p class="help is-danger" data-cy="ErrorMessage" v-if="titleError">
            Title is required
          </p>
        </div>

        <div class="field" data-cy="BodyField">
          <label class="label" for="post-body"> Write Post Body </label>
          <div class="control">
            <textarea
              id="post-body"
              name="body"
              placeholder="Post Body"
              v-model="body"
              class="textarea"
              :class="{ 'is-danger': bodyError }"
              @input="handleResetErrors"
            ></textarea>
          </div>

          <p class="help is-danger" data-cy="ErrorMessage" v-if="bodyError">
            Body is required
          </p>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button type="submit" class="button is-link">Save</button>
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
  </div>
</template>
