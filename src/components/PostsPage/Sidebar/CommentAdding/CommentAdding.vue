<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Comment } from "../../../../types/comment";
import { Post } from "../../../../types/post";

const props = defineProps<{
  chosenPost: Post;
  isCommentsEditing: boolean;
  changeCommentAddingState: () => void;
  addNewComment: ({ postId, name, body, email }: Comment) => Promise<void>;
}>();

const postId = ref<number>(props.chosenPost.id!);
const name = ref<string>("");
const email = ref<string>("");
const body = ref<string>("");
</script>

<template>
  <template v-if="!isCommentsEditing">
    <button type="button" class="button is-link" @click="changeCommentAddingState()">Write a comment</button>
  </template>

  <template v-else>
    <form @submit.prevent="addNewComment({ postId, name, email, body })">
      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-title">Author Name</label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="text"
            name="title"
            id="comment-author-name-title"
            placeholder="Name Surname"
            class="input"
            v-model="name"
          /><span class="icon is-small is-left"><i class="fas fa-user fa-heading"></i></span>
        </div>
      </div>

      <div class="field" data-cy="NameField">
        <label class="label" for="comment-author-name-email">Author Email</label>
        <div class="control has-icons-left has-icons-right">
          <input
            type="email"
            name="title"
            id="comment-author-name-email"
            placeholder="Your Email"
            class="input"
            v-model="email"
          /><span class="icon is-small is-left"><i class="fas fa-user fa-heading"></i></span>
        </div>
      </div>

      <div class="field" data-cy="BodyField">
        <label class="label" for="comment-body">Write comment</label>
        <div class="control">
          <textarea id="comment-body" name="body" placeholder="Post body" class="textarea" v-model="body"></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">
            <slot name="button">Add comment</slot>
          </button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="changeCommentAddingState()">Cancel</button>
        </div>
      </div>
    </form>
  </template>
</template>
