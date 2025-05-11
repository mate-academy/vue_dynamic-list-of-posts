<script setup>
import { usePostsStore } from "@/store/storePosts";
import Comment from "./Comment.vue";
import AddComment from "./AddComment.vue";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { getComments } from "@/api/comments";
import Loader from "../../loader/index.vue";

const postStore = usePostsStore();

const isLoadingComment = ref(false);
const isCreatingComment = ref(false);
const comments = ref([]);

const { isLoading, selectedPost } = storeToRefs(postStore);

const loadComments = async () => {
  isLoadingComment.value = true;
  try {
    comments.value = await getComments(selectedPost.value.id);
  } catch {
  } finally {
    isLoadingComment.value = false;
  }
};
onMounted(loadComments);

watch(selectedPost, loadComments);

const handleDelete = async () => {
  postStore.removePost(selectedPost.value.id);
};
</script>
<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>{{ `#${selectedPost.id}: ${selectedPost.title}` }}</h2>
      <div class="is-flex">
        <span
          @click="postStore.setIsEditing(true)"
          class="icon is-small is-right is-clickable"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          @click="handleDelete"
          class="icon is-small is-right has-text-danger is-clickable ml-3"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ selectedPost.body }}</p>
  </div>

  <div class="block is-flex is-justify-content-center" v-if="isLoadingComment">
    <Loader />
  </div>

  <div class="block">
    <Comment
      v-if="!isLoadingComment && comments.length !== 0"
      v-for="(comment, index) in comments"
      :key="comment.id"
      :comment="comment"
      @delete="comments = comments.filter(c => c.id !== comment.id)"
    />

    <div class="block" v-if="!isLoadingComment && comments.length === 0">
      <p class="title is-4">No comments yet</p>
    </div>

    <button
      v-if="!isCreatingComment"
      @click="isCreatingComment = true"
      type="button"
      class="button is-link"
    >
      Write a comment
    </button>

    <AddComment v-if="isCreatingComment" @close="isCreatingComment = false" @add="comments.push($event)" />
  </div>
</template>
