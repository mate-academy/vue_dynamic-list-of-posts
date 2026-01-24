<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import Loader from './Loader.vue';
import Comments from './Comments.vue';
import * as commentApi from '../api/comments';

const title = ref('');
const text = ref('');
const errorTitle = ref('');
const errorBody = ref('');

const props = defineProps({
  open: Boolean,
  mode: String,
  userId: [Number, String],
  isLoading: { type: Boolean, default: false }, error: { type: String },
  post: Object
});
const emit = defineEmits(['create', 'close', 'delete', 'update', 'edit']);

function handleSubmit() {
  if (!title.value) {
    errorTitle.value = 'Title is required';
    return;
  }

  if (!text.value) {
    errorBody.value = 'Body message is required';
    return;
  }

  if (props.mode === 'create') {
    emit('create', { title: title.value, body: text.value });
  } else if (props.mode === 'edit') {
    emit('update', { id: props.post.id, userId: props.userId, title: title.value, body: text.value });
  }

}

const comments = ref([]);
const isLoadingComments = ref(false);
const commentsError = ref('');

async function loadComments(postId) {
  isLoadingComments.value = true;

  try {
    comments.value = await commentApi.getComments(postId);
  } catch (error) {
    commentsError.value = 'Unable to load comments';
  } finally {
    isLoadingComments.value = false;
  }
}

async function addComment({ postId, name, email, body }) {
  isLoadingComments.value = true;

  try {
    const newComment = await commentApi.createComment({ postId, name, email, body });
    comments.value.push(newComment);
    commentsError.value = '';
  } catch (error) {
    commentsError.value = 'Unable to add a comment';
  } finally {
    isLoadingComments.value = false;
  }
}

async function deleteComment(id) {
  try {
    comments.value = comments.value.filter(comment => comment.id !== id);
    await commentApi.deleteComment(id);
    commentsError.value = '';
  } catch (error) {
    commentsError.value = 'Unable to delete a comment';
  }
}

watch(
  () => [props.mode, props.post],
  ([newMode, post]) => {
    if (newMode === 'create') {
      title.value = '';
      text.value = '';
      errorTitle.value = '';
      errorBody.value = '';
    } else if ((newMode === 'edit' || newMode === 'view') && post) {
      title.value = post.title;
      text.value = post.body;
      errorTitle.value = '';
      errorBody.value = '';
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="Sidebar" :class="{ 'Sidebar--open': open }">
    <div class="tile is-child box is-success " v-if="mode === 'create' || mode === 'edit'">
      <div class="tile is-child box is-success ">
        <Loader v-if="isLoading" />
        <div class="content" v-else>
          <h2>{{ mode === 'create' ? 'Create new post' : 'Post editing' }}</h2>

          <form @submit.prevent="handleSubmit">
            <div class="field" data-cy="NameField">
              <label class="label" for="comment-author-name-title">Title</label>
              <div class="control has-icons-left has-icons-right">
                <input type="text" name="title" id="comment-author-name-title" placeholder="Post title" class="input"
                  :class="{ 'is-danger': errorTitle }" v-model="title">
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
              </div>

              <p class="help is-danger" v-if="errorTitle">{{ errorTitle }}</p>
            </div>
            <div class="field" data-cy="BodyField">
              <label class="label" for="comment-author-name-title">Write Post Body</label>
              <div class="control">
                <textarea name="body" id="comment-body" placeholder="Post body" class="textarea"
                  :class="{ 'is-danger': errorBody }" v-model="text"></textarea>
              </div>

              <p class="help is-danger" v-if="errorBody">{{ errorBody }}</p>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button type="submit" class="button is-link">{{ mode === 'create' ? 'Create' : 'Save' }}</button>
              </div>
              <div class="control">
                <button type="reset" class="button is-link is-light" @click="emit('close')">Cancel</button>
              </div>
            </div>
          </form>
        </div>
        <article class="message is-danger" v-if="error">
          <div class="message-body">
            <p class="help is-danger">{{ error }}</p>
          </div>
        </article>
      </div>
    </div>
    <div class="tile is-child box is-success " v-if="mode === 'view'">
      <div class="tile is-child box is-success ">
        <div class="content">
          <div class="block">
            <div class="is-flex is-justify-content-space-between is-align-items-center">
              <h2>#{{ post.id }}: {{ post.title }}</h2>
              <div class="is-flex">
                <button @click="emit('edit')">
                  <span class="icon is-small is-right is-clickable">
                    <i class="fas fa-pen-to-square"></i>
                  </span>
                </button>
                <button @click="emit('delete', post.id)">
                  <span class="icon is-small is-right has-text-danger is-clickable ml-3">
                    <i class="fas fa-trash"></i>
                  </span>
                </button>
              </div>
            </div>
            <p data-cy="PostBody">{{ post.body }}</p>
          </div>
          <Comments :comments="comments" :postId="post.id" :isLoading="isLoadingComments" :errorMessage="commentsError"
            @load="loadComments" @add="addComment" @delete="deleteComment" @close="emit('close')" />
          <article class="message is-danger" v-if="error">
            <div class="message-body">
              <p class="help is-danger">{{ error }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

.Sidebar--open {
  opacity: 1;
}
</style>
