<script setup lang="ts">
import { addComment, getComments, removeComment } from "@/assets/api/api";
import type { Comment } from "@/assets/types/Comment";
import type { Post } from "@/assets/types/Post";
import { ref, watch } from "vue";
import Loader from "./Loader.vue";
import AddComment from "./AddComment.vue";

const props = defineProps<{
  post: Post | null;
  handleRemovePost: (postId: number) => void;
  handleOpenEditPost: (post: Post) => void;
}>();

const addingComment = ref(false);
const commentArr = ref<Comment[] | null>(null);

watch(
  () => props.post,
  (newPost) => {
    commentArr.value = null;
    if (newPost?.id) {
      getComments(newPost.id).then((res) => {
        commentArr.value = res;
      });
    }
  },
  { immediate: true }
);

const remove = () => {
  if (props.post?.id) {
    props.handleRemovePost(props.post.id);
  }
};

const edit = () => {
  if (props.post) {
    props.handleOpenEditPost(props.post);
  }
};

const handleRemoveComment = (commentId: number) => {
  removeComment(commentId).then(() => {
    commentArr.value = commentArr.value
      ? commentArr.value.filter((el) => el.id !== commentId)
      : null;
  });
};

const handleAddComment = (name: string, email: string, body: string) => {
  handleCloseAddComment();

  if (props.post?.id) {
    const comment = { postId: props.post?.id, name, email, body };
    addComment(comment).then((res) =>
      commentArr.value ? commentArr.value.push(res) : null
    );
  }
};

const handleOpenAddComment = () => {
  addingComment.value = true;
};

const handleCloseAddComment = () => {
  addingComment.value = false;
};
</script>

<template>
  <div class="tile is-child box is-success flex-itemDown">
    <div class="content">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center"
      >
        <h2 class="title is-4">#{{ post?.id }}: {{ post?.title }}</h2>
        <div class="is-flex">
          <span class="icon is-small is-right is-clickable" @click="edit">
            <i class="fas fa-pen-to-square" />
          </span>
          <span
            class="icon is-small is-right has-text-danger is-clickable ml-3"
            @click="remove"
          >
            <i class="fas fa-trash" />
          </span>
        </div>
      </div>

      <div class="block">
        <p data-cy="PostBody">{{ post?.body }}</p>
      </div>

      <div class="block" v-if="addingComment">
        <AddComment
          :handleAddComment="handleAddComment"
          :handleClose="handleCloseAddComment"
        />
      </div>

      <div class="block" v-else>
        <div v-if="!commentArr" class="block is-flex is-justify-content-center">
          <Loader />
        </div>

        <p class="title is-4" v-else-if="commentArr?.length === 0">
          No comments yet
        </p>

        <article
          class="message is-small"
          v-for="comment in commentArr"
          :key="comment.id"
        >
          <div class="message-header">
            <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
            <button
              type="button"
              class="delete is-small"
              aria-label="delete"
              @click="handleRemoveComment(comment.id)"
            />
          </div>
          <div class="message-body">{{ comment.body }}</div>
        </article>
        <div class="control" v-if="commentArr">
          <button
            type="submit"
            class="button is-link"
            @click="handleOpenAddComment"
          >
            Write a comment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
