<script setup>
import WriteCommentBtn from './WriteCommentBtn.vue';
import Comment from './Comment.vue';
import NoCommentsYet from './NoCommentsYet.vue';
import Loader from '../loader/Loader.vue';
import AddComment from './AddComment.vue';
import { usePostStore } from '../../stores/postsStore';
import { useCommentStore } from '../../stores/commentsStore';

const postStore = usePostStore();
const commentStore = useCommentStore();

async function handleUpdatePost() {
  try {
    await postStore.updateCurrentPost();
  } catch (err) {
    postStore.errorMessages.fetch = 'Error updating post: ' + err.message;
  }
}

async function handleDeletePost(id) {
  try {
    await postStore.deletePostById(id);
  } catch (err) {
    postStore.errorMessages.fetch = 'Error deleting post: ' + err.message;
  }
}

function startEditing() {
  postStore.editingPost = { ...postStore.isCommentDetailsActive };
  postStore.toggleAddPostBtn();
}
</script>
<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2>
        #{{ postStore.isCommentDetailsActive.id }}:
        {{ postStore.isCommentDetailsActive.title }}
      </h2>
      <div class="is-flex">
        <span class="icon is-small is-right is-clickable" @click="startEditing">
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="handleDeletePost(postStore.isCommentDetailsActive.id)"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p data-cy="PostBody">{{ postStore.isCommentDetailsActive.body }}</p>
  </div>
  <Loader v-if="commentStore.isCommentsListLoading" />
  <div class="block" v-else>
    <NoCommentsYet v-if="commentStore.commentsList.length === 0" />
    <Comment v-if="!commentStore.isCommentFormVisible" />
    <WriteCommentBtn
      v-if="!commentStore.isCommentFormVisible"
      @click="commentStore.toggleCommentForm()"
    />
    <AddComment v-if="commentStore.isCommentFormVisible" />
  </div>
</template>
