<script setup>
import { computed, nextTick, ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import Loader from './components/Loader.vue';
import LoginForm from './components/LoginForm.vue';
import PostsList from './components/PostsList.vue';
import Sidebar from './components/Sidebar.vue';
import {
  createComment,
  deleteComment as deleteCommentRequest,
  getCommentsByPostId,
} from './api/comments.js';
import {
  createPost,
  deletePost as deletePostRequest,
  getPostsByUserId,
  updatePost,
} from './api/posts.js';

const user = ref(null);
const posts = ref([]);
const postsLoading = ref(false);
const postsError = ref('');
const selectedPostId = ref(null);
const sidebarMode = ref('closed');
const postSubmitting = ref(false);
const deletingPost = ref(false);

const comments = ref([]);
const commentsLoading = ref(false);
const commentsError = ref('');
const commentFormVisible = ref(false);
const commentSubmitting = ref(false);
const commentSuccessToken = ref(0);
const deletingCommentIds = ref([]);
const transientError = ref('');

let postsRequestId = 0;
let commentsRequestId = 0;
let transientTimer = null;

const selectedPost = computed(() =>
  posts.value.find(post => post.id === selectedPostId.value) || null,
);

const sidebarOpen = computed(() => sidebarMode.value !== 'closed');
const creatingPost = computed(() => sidebarMode.value === 'create');

function showTransientError(message) {
  transientError.value = message;

  if (transientTimer) {
    window.clearTimeout(transientTimer);
  }

  transientTimer = window.setTimeout(() => {
    transientError.value = '';
    transientTimer = null;
  }, 5000);
}

function resetCommentsState() {
  commentsRequestId += 1;
  comments.value = [];
  commentsLoading.value = false;
  commentsError.value = '';
  commentFormVisible.value = false;
  deletingCommentIds.value = [];
}

function closeSidebar() {
  selectedPostId.value = null;
  sidebarMode.value = 'closed';
  resetCommentsState();
}

async function handleAuthenticated(nextUser) {
  user.value = nextUser;
  posts.value = [];
  postsError.value = '';
  closeSidebar();
  await loadPosts();
}

function logout() {
  postsRequestId += 1;
  commentsRequestId += 1;
  user.value = null;
  posts.value = [];
  postsLoading.value = false;
  postsError.value = '';
  transientError.value = '';
  closeSidebar();
}

async function loadPosts() {
  if (!user.value) {
    return;
  }

  const requestId = ++postsRequestId;
  postsLoading.value = true;
  postsError.value = '';
  posts.value = [];

  try {
    const loadedPosts = await getPostsByUserId(user.value.id);

    if (requestId === postsRequestId) {
      posts.value = loadedPosts;
    }
  } catch (error) {
    if (requestId === postsRequestId) {
      postsError.value = error.message || 'Unable to load posts.';
    }
  } finally {
    if (requestId === postsRequestId) {
      postsLoading.value = false;
    }
  }
}

function openCreateForm() {
  selectedPostId.value = null;
  resetCommentsState();
  sidebarMode.value = 'create';
}

async function togglePost(post) {
  if (selectedPostId.value === post.id && sidebarMode.value === 'preview') {
    closeSidebar();
    return;
  }

  selectedPostId.value = post.id;
  sidebarMode.value = 'preview';
  resetCommentsState();
  await loadComments(post.id);
}

async function loadComments(postId = selectedPostId.value) {
  if (!postId) {
    return;
  }

  const requestId = ++commentsRequestId;
  commentsLoading.value = true;
  commentsError.value = '';
  comments.value = [];

  try {
    const loadedComments = await getCommentsByPostId(postId);

    if (requestId === commentsRequestId && selectedPostId.value === postId) {
      comments.value = loadedComments;
    }
  } catch (error) {
    if (requestId === commentsRequestId && selectedPostId.value === postId) {
      commentsError.value = error.message || 'Unable to load comments.';
    }
  } finally {
    if (requestId === commentsRequestId && selectedPostId.value === postId) {
      commentsLoading.value = false;
    }
  }
}

function editSelectedPost() {
  if (selectedPost.value) {
    sidebarMode.value = 'edit';
  }
}

function cancelPostForm() {
  if (sidebarMode.value === 'edit' && selectedPost.value) {
    sidebarMode.value = 'preview';
    return;
  }

  closeSidebar();
}

async function savePost(payload) {
  if (!user.value) {
    return;
  }

  postSubmitting.value = true;
  transientError.value = '';

  try {
    if (sidebarMode.value === 'edit' && selectedPost.value) {
      const postId = selectedPost.value.id;
      const updated = await updatePost(postId, payload);
      const index = posts.value.findIndex(post => post.id === postId);

      if (index !== -1) {
        posts.value.splice(index, 1, {
          ...posts.value[index],
          ...updated,
          ...payload,
        });
      }

      if (selectedPostId.value === postId && sidebarMode.value === 'edit') {
        sidebarMode.value = 'preview';
      }

      return;
    }

    const created = await createPost({
      ...payload,
      userId: user.value.id,
    });

    posts.value.push(created);
    selectedPostId.value = created.id;
    sidebarMode.value = 'preview';
    resetCommentsState();
    await nextTick();
    await loadComments(created.id);
  } catch (error) {
    showTransientError(error.message || 'Unable to save the post. Please retry.');
  } finally {
    postSubmitting.value = false;
  }
}

async function removeSelectedPost() {
  if (!selectedPost.value || deletingPost.value) {
    return;
  }

  const postToDelete = selectedPost.value;
  deletingPost.value = true;

  try {
    await deletePostRequest(postToDelete.id);
    posts.value = posts.value.filter(post => post.id !== postToDelete.id);

    if (selectedPostId.value === postToDelete.id) {
      closeSidebar();
    }
  } catch (error) {
    showTransientError(error.message || 'Unable to delete the post. Please retry.');
  } finally {
    deletingPost.value = false;
  }
}

async function addComment(payload) {
  if (!selectedPost.value || commentSubmitting.value) {
    return;
  }

  const postId = selectedPost.value.id;
  commentSubmitting.value = true;

  try {
    const created = await createComment({
      ...payload,
      postId,
    });

    if (selectedPostId.value === postId) {
      comments.value.push(created);
      commentSuccessToken.value += 1;
    }
  } catch (error) {
    showTransientError(error.message || 'Unable to add the comment. Please retry.');
  } finally {
    commentSubmitting.value = false;
  }
}

async function removeComment(comment) {
  if (deletingCommentIds.value.includes(comment.id)) {
    return;
  }

  const index = comments.value.findIndex(item => item.id === comment.id);

  if (index === -1) {
    return;
  }

  const postId = selectedPostId.value;
  const requestContextId = commentsRequestId;

  deletingCommentIds.value.push(comment.id);
  comments.value.splice(index, 1);

  try {
    await deleteCommentRequest(comment.id);
  } catch (error) {
    if (selectedPostId.value === postId && commentsRequestId === requestContextId) {
      const safeIndex = Math.min(index, comments.value.length);
      comments.value.splice(safeIndex, 0, comment);
    }

    showTransientError(error.message || 'Unable to delete the comment. Please retry.');
  } finally {
    deletingCommentIds.value = deletingCommentIds.value.filter(id => id !== comment.id);
  }
}
</script>

<template>
  <LoginForm v-if="!user" @authenticated="handleAuthenticated" />

  <div v-else class="app-shell">
    <AppHeader :user="user" @logout="logout" />

    <div
      v-if="transientError"
      class="notification is-danger floating-notification"
      data-cy="ActionError"
      role="alert"
    >
      <button class="delete" aria-label="Dismiss error" @click="transientError = ''"></button>
      {{ transientError }}
    </div>

    <main class="section app-main">
      <div class="tile is-ancestor app-layout">
        <section class="tile is-parent is-4-desktop" data-cy="MainContent">
          <div class="tile is-child">
            <Loader v-if="postsLoading" />

            <div v-else-if="postsError" class="notification is-danger is-light" data-cy="PostsLoadingError">
              <p>{{ postsError }}</p>
              <button type="button" class="button is-danger is-light is-small mt-2" @click="loadPosts">
                Retry
              </button>
            </div>

            <div v-else-if="posts.length === 0" class="box" data-cy="NoPostsYet">
              <div class="is-flex is-justify-content-space-between is-align-items-center gap-2">
                <p class="title is-5 mb-0">
                  No posts yet
                </p>
                <button type="button" class="button is-link" data-cy="AddNewPostButton" @click="openCreateForm">
                  Add New Post
                </button>
              </div>
            </div>

            <PostsList
              v-else
              :posts="posts"
              :selected-post-id="selectedPostId"
              :creating-post="creatingPost"
              @add="openCreateForm"
              @toggle="togglePost"
            />
          </div>
        </section>

        <Sidebar
          :open="sidebarOpen"
          :mode="sidebarMode"
          :post="selectedPost"
          :post-submitting="postSubmitting"
          :comments="comments"
          :comments-loading="commentsLoading"
          :comments-error="commentsError"
          :comment-form-visible="commentFormVisible"
          :comment-submitting="commentSubmitting"
          :comment-success-token="commentSuccessToken"
          :deleting-comment-ids="deletingCommentIds"
          :deleting-post="deletingPost"
          @save-post="savePost"
          @cancel-form="cancelPostForm"
          @edit-post="editSelectedPost"
          @delete-post="removeSelectedPost"
          @retry-comments="loadComments"
          @show-comment-form="commentFormVisible = true"
          @add-comment="addComment"
          @delete-comment="removeComment"
        />
      </div>
    </main>
  </div>
</template>
