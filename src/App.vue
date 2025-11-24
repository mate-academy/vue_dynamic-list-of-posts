<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import LoginForm from './components/LoginForm.vue';
import RegistrationForm from './components/RegistrationForm.vue';
import PostList from './components/PostList.vue';
import Sidebar from './components/Sidebar.vue';
import Loader from './components/Loader.vue';
import { store } from './store';
import {
  getUser,
  createUser,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getComments,
  createComment,
  deleteComment,
} from './services/api';

const needsRegistration = ref(false);
const attemptedEmail = ref('');
const sidebarMode = ref('');

const handleLogin = async (email) => {
  try {
    const users = await getUser(email);
    if (users.length > 0) {
      store.user = users[0];
      await loadPosts();
    } else {
      needsRegistration.value = true;
      attemptedEmail.value = email;
    }
  } catch (error) {}
};

const handleRegister = async ({ email, name }) => {
  try {
    const newUser = await createUser({ email, name });
    store.user = newUser;
    needsRegistration.value = false;
    await loadPosts();
  } catch (error) {}
};

const handleLogout = () => {
  store.user = null;
  store.posts = [];
  store.selectedPost = null;
  store.isSidebarOpen = false;
  needsRegistration.value = false;
};

const loadPosts = async () => {
  store.arePostsLoading = true;
  store.postsError = null;
  try {
    const allPosts = await getPosts();
    store.posts = allPosts.filter((post) => post.userId === store.user.id);
  } catch (error) {
    store.postsError = 'Failed to load posts';
  } finally {
    store.arePostsLoading = false;
  }
};

const handleCreateNewPost = () => {
  store.selectedPost = null;
  sidebarMode.value = 'create';
  store.isSidebarOpen = true;
  store.comments = [];
};

const handleSelectPost = async (post) => {
  store.selectedPost = post;
  sidebarMode.value = 'view';
  store.isSidebarOpen = true;
  await loadComments(post.id);
};

const handleSavePost = async (postData) => {
  try {
    if (sidebarMode.value === 'create') {
      const newPost = await createPost({
        ...postData,
        userId: store.user.id,
      });
      store.posts.push(newPost);
      store.selectedPost = newPost;
      sidebarMode.value = 'view';
      store.comments = [];
    } else if (sidebarMode.value === 'edit') {
      const updatedPost = await updatePost({
        id: store.selectedPost.id,
        ...postData,
      });
      const index = store.posts.findIndex((p) => p.id === updatedPost.id);
      if (index !== -1) {
        store.posts[index] = { ...store.posts[index], ...updatedPost };
      }
      store.selectedPost = { ...store.selectedPost, ...updatedPost };
      sidebarMode.value = 'view';
    }
  } catch (error) {}
};

const handleEditPost = () => {
  sidebarMode.value = 'edit';
};

const handleDeletePost = async () => {
  try {
    await deletePost(store.selectedPost.id);
    store.posts = store.posts.filter((p) => p.id !== store.selectedPost.id);
    store.selectedPost = null;
    store.isSidebarOpen = false;
    sidebarMode.value = '';
  } catch (error) {}
};

const handleCloseSidebar = () => {
  store.isSidebarOpen = false;
  store.selectedPost = null;
  sidebarMode.value = '';
};

const loadComments = async (postId) => {
  store.areCommentsLoading = true;
  store.commentsError = null;
  try {
    store.comments = await getComments(postId);
  } catch (error) {
    store.commentsError = 'Failed to load comments';
  } finally {
    store.areCommentsLoading = false;
  }
};

const handleAddComment = async (commentData) => {
  try {
    const newComment = await createComment({
      postId: store.selectedPost.id,
      ...commentData,
    });
    store.comments.push(newComment);
  } catch (error) {}
};

const handleDeleteComment = async (commentId) => {
  store.comments = store.comments.filter((c) => c.id !== commentId);
  
  try {
    await deleteComment(commentId);
  } catch (error) {}
};
</script>

<template>
  <div>
    <div v-if="!store.user">
      <RegistrationForm
        v-if="needsRegistration"
        :initial-email="attemptedEmail"
        @submit="handleRegister"
      />
      <LoginForm v-else @submit="handleLogin" />
    </div>

    <div v-else>
      <Header :user="store.user" @logout="handleLogout" />

      <div class="section">
        <div class="container">
          <div class="tile is-ancestor">
            <div
              v-if="store.arePostsLoading"
              class="tile is-parent"
            >
              <div class="tile is-child box">
                <div class="is-flex is-justify-content-center is-align-items-center mt-2">
                  <Loader />
                </div>
              </div>
            </div>

            <div
              v-else-if="store.postsError"
              class="tile is-parent"
            >
              <div class="tile is-child box">
                <div class="notification is-danger">
                  {{ store.postsError }}
                </div>
              </div>
            </div>

            <div
              v-else-if="store.posts.length === 0"
              class="tile is-parent"
            >
              <div class="tile is-child box">
                <div class="block">
                  <div class="block is-flex is-justify-content-space-between">
                    <p class="title">Posts</p>
                    <button
                      type="button"
                      class="button is-link"
                      @click="handleCreateNewPost"
                    >
                      Add New Post
                    </button>
                  </div>
                  <div class="notification is-info">
                    No posts yet
                  </div>
                </div>
              </div>
            </div>

            <PostList
              v-else
              :posts="store.posts"
              :selected-post="store.selectedPost"
              @select="handleSelectPost"
              @create="handleCreateNewPost"
              @close="handleCloseSidebar"
            />

            <Sidebar
              :is-open="store.isSidebarOpen"
              :mode="sidebarMode"
              :post="store.selectedPost"
              :comments="store.comments"
              :are-comments-loading="store.areCommentsLoading"
              :comments-error="store.commentsError"
              :user-id="store.user.id"
              @save-post="handleSavePost"
              @edit-post="handleEditPost"
              @delete-post="handleDeletePost"
              @add-comment="handleAddComment"
              @delete-comment="handleDeleteComment"
              @close="handleCloseSidebar"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
