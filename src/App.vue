<script setup>
import { onMounted, ref } from 'vue';

import Header from './components/Header.vue';
import PostsList from './components/PostsList.vue';
import Sidebar from './components/Sidebar.vue';

import * as postsApi from './api/posts';
import * as commentsApi from './api/comments';
import * as usersApi from './api/users';

const USER_ID = 4192;

const user = ref(null);

const isLoading = ref(false);
const errorMessage = ref('');
const posts = ref([]);

const selectedPost = ref(null);
const isSidebarOpen = ref(false);
const isEditing = ref(false);

const comments = ref([]);
const areCommentsLoading = ref(false);
const commentsError = ref('');

const isCommentFormVisible = ref(false);
const isCommentSubmitting = ref(false);

onMounted(async () => {
  isLoading.value = true;

  try {
    const [loadedUser, loadedPosts] = await Promise.all([
      usersApi.getUser(USER_ID),
      postsApi.getPosts(USER_ID),
    ]);

    user.value = loadedUser;
    posts.value = loadedPosts;
  } catch (error) {
    errorMessage.value = 'Unable to load data';
  } finally {
    isLoading.value = false;
  }
});

const openNewPostForm = () => {
  selectedPost.value = null;
  isEditing.value = false;
  isSidebarOpen.value = true;
  isCommentFormVisible.value = false;
  comments.value = [];
  commentsError.value = '';
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  isEditing.value = false;
  isCommentFormVisible.value = false;
};

const openPost = (post) => {
  if (selectedPost.value?.id === post.id && isSidebarOpen.value) {
    closeSidebar();
    return;
  }

  selectedPost.value = post;
  isEditing.value = false;
  isSidebarOpen.value = true;
  isCommentFormVisible.value = false;

  loadComments(post.id);
};

const createPost = async ({ title, body }) => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const newPost = await postsApi.createPost({
      userId: USER_ID,
      title,
      body,
    });

    posts.value.unshift(newPost);
    selectedPost.value = newPost;
    isSidebarOpen.value = true;
    isEditing.value = false;
    comments.value = [];
    commentsError.value = '';
    isCommentFormVisible.value = false;
  } catch (error) {
    errorMessage.value = 'Unable to create post';
  } finally {
    isLoading.value = false;
  }
};

const deletePost = async (postId) => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await postsApi.deletePost(postId);

    posts.value = posts.value.filter(post => post.id !== postId);
    selectedPost.value = null;
    closeSidebar();
    comments.value = [];
    commentsError.value = '';
  } catch (error) {
    errorMessage.value = 'Unable to delete post';
  } finally {
    isLoading.value = false;
  }
};

const updatePost = async ({ title, body }) => {
  if (!selectedPost.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const updatedPost = await postsApi.updatePost({
      id: selectedPost.value.id,
      title,
      body,
    });

    const currentPost = posts.value.find(post => post.id === updatedPost.id);

    if (currentPost) {
      Object.assign(currentPost, updatedPost);
    }

    selectedPost.value = updatedPost;
    isEditing.value = false;
  } catch (error) {
    errorMessage.value = 'Unable to update post';
  } finally {
    isLoading.value = false;
  }
};

const loadComments = async (postId) => {
  comments.value = [];
  commentsError.value = '';
  areCommentsLoading.value = true;

  try {
    comments.value = await commentsApi.getComments(postId);
  } catch (error) {
    commentsError.value = 'Unable to load comments';
  } finally {
    areCommentsLoading.value = false;
  }
};

const createComment = async ({ name, email, body }) => {
  if (!selectedPost.value) {
    return;
  }

  commentsError.value = '';
  isCommentSubmitting.value = true;

  try {
    const newComment = await commentsApi.createComment({
      postId: selectedPost.value.id,
      name,
      email,
      body,
    });

    comments.value.push(newComment);
  } catch (error) {
    commentsError.value = 'Unable to add a comment';
  } finally {
    isCommentSubmitting.value = false;
  }
};

const deleteComment = async (commentId) => {
  const commentToDelete = comments.value.find(comment => comment.id === commentId);

  comments.value = comments.value.filter(comment => comment.id !== commentId);
  commentsError.value = '';

  try {
    await commentsApi.deleteComment(commentId);
  } catch (error) {
    commentsError.value = 'Unable to delete a comment';

    if (commentToDelete) {
      comments.value.push(commentToDelete);
    }
  }
};
</script>

<template>
  <Header
    v-if="user"
    :user="user"
    @logout="user = null"
  />

  <section class="section">
    <div class="container">
      <div class="columns">
        <div
          class="column"
          :class="{ 'is-half': isSidebarOpen }"
        >
          <PostsList
            :posts="posts"
            :selected-post="selectedPost"
            :is-sidebar-open="isSidebarOpen"
            :is-loading="isLoading"
            :error-message="errorMessage"
            @add="openNewPostForm"
            @open="openPost"
          />
        </div>

        <div
          v-if="isSidebarOpen"
          class="column is-half Sidebar Sidebar--open"
        >
          <Sidebar
            :selected-post="selectedPost"
            :is-editing="isEditing"
            :comments="comments"
            :are-comments-loading="areCommentsLoading"
            :comments-error="commentsError"
            :is-comment-form-visible="isCommentFormVisible"
            :is-comment-submitting="isCommentSubmitting"
            @close="closeSidebar"
            @create-post="createPost"
            @update-post="updatePost"
            @cancel-edit="isEditing = false"
            @edit-post="isEditing = true"
            @delete-post="deletePost"
            @delete-comment="deleteComment"
            @show-comment-form="isCommentFormVisible = true"
            @create-comment="createComment"
          />
        </div>
      </div>
    </div>
  </section>
</template>