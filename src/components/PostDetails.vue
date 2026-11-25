<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Post } from '@/types/Post';
import type { Comment } from '@/types/Comment';
import { client } from '@/api/fetchClient';
import Loader from './Loader.vue';
import NewCommentForm from './NewCommentForm.vue';
import PostForm from './PostForm.vue';

interface Props {
  post: Post;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  deleted: [postId: number];
  updated: [post: Post];
  close: [];
}>();

const comments = ref<Comment[]>([]);
const commentsLoading = ref(true);
const commentsError = ref(false);
const showCommentForm = ref(false);
const deleteError = ref<string | null>(null);
const currentPostId = ref(props.post.id);
const showEditForm = ref(false);
const postDeleteError = ref<string | null>(null);

async function loadComments(postId: number): Promise<void> {
  commentsLoading.value = true;
  commentsError.value = false;
  comments.value = [];
  showCommentForm.value = false;
  deleteError.value = null;

  try {
    const data = await client.get<Comment[]>(`/comments?postId=${postId}`);
    if (currentPostId.value === postId) {
      comments.value = data;
      commentsLoading.value = false;
    }
  } catch {
    if (currentPostId.value === postId) {
      commentsError.value = true;
      commentsLoading.value = false;
    }
  }
}

watch(
  () => props.post.id,
  (newId) => {
    currentPostId.value = newId;
    showEditForm.value = false;
    postDeleteError.value = null;
    loadComments(newId);
  },
  { immediate: true }
);

async function handleDeleteComment(commentId: number): Promise<void> {
  deleteError.value = null;
  const removedComment = comments.value.find((c) => c.id === commentId);
  const postIdAtDelete = currentPostId.value;

  if (removedComment) {
    comments.value = comments.value.filter((c: Comment) => c.id !== commentId);

    try {
      await client.delete(`/comments/${commentId}`);
    } catch {
      if (currentPostId.value === postIdAtDelete) {
        comments.value = [...comments.value, removedComment].sort((a: Comment, b: Comment) => a.id - b.id);
      }
      deleteError.value = 'Unable to delete a comment';
    }
  }
}

async function handleDeletePost(): Promise<void> {
  postDeleteError.value = null;
  const postId = props.post.id;

  try {
    await client.delete(`/posts/${postId}`);
    emit('deleted', postId);
    emit('close');
  } catch {
    postDeleteError.value = 'Unable to delete post';
  }
}

function handleEditPost(): void {
  showEditForm.value = true;
}

function handlePostSaved(updatedPost: Post): void {
  emit('updated', updatedPost);
  showEditForm.value = false;
}

function handlePostFormCancel(): void {
  showEditForm.value = false;
}

function handleCommentAdded(newComment: Comment): void {
  comments.value = [...comments.value, newComment];
  showCommentForm.value = false;
}

const showNoComments = computed(
  () => !commentsLoading.value && !commentsError.value && comments.value.length === 0
);

const showComments = computed(
  () => !commentsLoading.value && !commentsError.value && comments.value.length > 0
);
</script>

<template>
  <div class="content" data-cy="PostDetails">
    <div class="block" v-if="!showEditForm">
      <div class="is-flex is-justify-content-space-between is-align-items-center">
        <h2 data-cy="PostTitle">#{{ props.post.id }}: {{ props.post.title }}</h2>
        <div class="is-flex">
          <span class="icon is-small is-right is-clickable" @click="handleEditPost" data-cy="EditPostButton">
            <i class="fas fa-pen-to-square"></i>
          </span>
          <span class="icon is-small is-right has-text-danger is-clickable ml-3" @click="handleDeletePost" data-cy="DeletePostButton">
            <i class="fas fa-trash"></i>
          </span>
        </div>
      </div>
      <p data-cy="PostBody" style="white-space: pre-line;">{{ props.post.body }}</p>

      <div v-if="postDeleteError" class="notification is-danger" data-cy="DeletePostError">
        {{ postDeleteError }}
      </div>
    </div>

    <PostForm
      v-if="showEditForm"
      :post="props.post"
      :user-id="props.post.userId"
      @save="handlePostSaved"
      @cancel="handlePostFormCancel"
    />

    <div class="block" v-if="!showEditForm">
      <Loader v-if="commentsLoading" />

      <div v-if="commentsError" class="notification is-danger" data-cy="CommentsError">
        Something went wrong
      </div>

      <p v-if="showNoComments" class="title is-4" data-cy="NoCommentsMessage">
        No comments yet
      </p>

      <p v-if="showComments" class="title is-4">Comments:</p>

      <article
        v-for="comment in comments"
        :key="comment.id"
        class="message is-small"
        data-cy="Comment"
      >
        <div class="message-header">
          <a :href="`mailto:${comment.email}`" data-cy="CommentAuthor">
            {{ comment.name }}
          </a>
          <button
            data-cy="CommentDelete"
            type="button"
            class="delete is-small"
            aria-label="delete"
            @click="handleDeleteComment(comment.id)"
          />
        </div>
        <div class="message-body" data-cy="CommentBody" style="white-space: pre-line;">
          {{ comment.body }}
        </div>
      </article>

      <div v-if="deleteError" class="notification is-danger" data-cy="DeleteCommentError">
        Unable to delete a comment
      </div>

      <button
        v-if="!showCommentForm && !commentsLoading && !commentsError"
        data-cy="WriteCommentButton"
        type="button"
        class="button is-link"
        @click="showCommentForm = true"
      >
        Write a comment
      </button>

      <NewCommentForm
        v-if="showCommentForm"
        :post-id="props.post.id"
        @added="handleCommentAdded"
      />
    </div>
  </div>
</template>