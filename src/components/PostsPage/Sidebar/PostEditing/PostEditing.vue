<script setup lang="ts">
import { ref, watch } from "vue";
import { Post } from "../../../../types/post";
import { User } from "../../../../types/user";

const props = defineProps<{
  user: User;
  closePostEditing: () => void;
  chosenPost?: Post;
  submitPostChange: ({ id, userId, title, body }: Post) => Promise<void>
}>();

const title = ref<string>("");
const body = ref<string>("");
const id = ref(0);

if (props.chosenPost) {
  title.value = props.chosenPost.title || "";
  body.value = props.chosenPost.body || "";
  id.value = props.chosenPost.id!;
}

const userId = props.user.id!;

watch(
  () => props.chosenPost,
  (newPost) => {
    if (newPost) {
      title.value = newPost.title || "";
      body.value = newPost.body || "";
      id.value = newPost.id!;
    }
  },
  { immediate: true }
);
</script>

<template>
  <slot name="title"><h2>Title</h2></slot>

  <form @submit.prevent="submitPostChange({ id, userId, title, body })">
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name-title">Title</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          name="title"
          id="comment-author-name-title"
          placeholder="Post title"
          class="input"
          v-model="title"
        /><span class="icon is-small is-left"><i class="fas fa-user fa-heading"></i></span>
      </div>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Write Post Body</label>
      <div class="control">
        <textarea id="comment-body" name="body" placeholder="Post body" class="textarea" v-model="body"></textarea>
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">
          <slot name="button">Save</slot>
        </button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light" @click="closePostEditing()">Cancel</button>
      </div>
    </div>
  </form>
</template>
