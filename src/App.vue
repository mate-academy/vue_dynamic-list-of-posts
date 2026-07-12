<script setup>
import { onMounted, ref, Transition } from "vue";
import {
  getPosts,
  getMe,
  registerUser,
  addPost,
  deletePost,
  getComments,
  deleteComment,
  addComment,
  updatePost,
} from "./services/getPosts";

import AppNavbar from "./components/NavBar.vue";
import Loader from "./components/Loader.vue";
import PostsList from "./components/PostsList.vue";
import PostDetails from "./components/PostDetails.vue";
import PostEditForm from "./components/PostEditForm.vue";
import NewPostForm from "./components/NewPostForm.vue";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";

const posts = ref([]);
const errorMessagePosts = ref("");
const errorMessageComments = ref("");
const errorMessageDeletePost = ref("");
const errorMessageEditPost = ref("");
const errorMessageDeleteComment = ref("");
const errorMessageResetEdit = ref("");

const isLoading = ref(false);
const loadingLogin = ref(false);
const loadingRegister = ref(false);
const loadingComments = ref(false);
const loadingPostEditing = ref(false);
const loadingWriteComment = ref(false);
const errorWriteComment = ref("");
const loadingAddComment = ref(false);

const loginInput = ref("");
const userId = ref(localStorage.getItem("userId"));
const name = ref("");

const errorMessageLogin = ref("");
const errorMessageRegister = ref("");

const showReg = ref(false);
const showAddPost = ref(false);
const writeComment = ref(false);
const showUpdatePost = ref(false);
const editingPost = ref(null);

const userName = ref("");

const title = ref("");
const errorTitle = ref("");

const body = ref("");
const errorBody = ref("");

const currentPost = ref(null);
const comments = ref([]);

const authorName = ref("");
const errorMessageAuthorName = ref("");

const authorEmail = ref("");
const errorMessageAuthorEmail = ref("");

const authorBody = ref("");
const errorMessageAuthorBody = ref("");

const commentWriteError = ref("");

const editTitle = ref("");
const editBody = ref("");

const handleLoginChange = (event) => {
  loginInput.value = event.target.value;
  errorMessageLogin.value = "";
};

const handleUserNameChange = (event) => {
  userName.value = event.target.value;
  errorMessageRegister.value = "";
};

const handleTitleChange = (event) => {
  title.value = event.target.value;
  errorTitle.value = "";
};

const handleAuthorNameChange = (event) => {
  authorName.value = event.target.value;
  errorMessageAuthorName.value = "";
};

const handleAuthorEmailChange = (event) => {
  authorEmail.value = event.target.value;
  errorMessageAuthorEmail.value = "";
};

const handleAuthorBodyChange = (event) => {
  authorBody.value = event.target.value;
  errorMessageAuthorBody.value = "";
};

const handleBodyChange = (event) => {
  body.value = event.target.value;
  errorBody.value = "";
};

const handleEditTitleChange = (event) => {
  editTitle.value = event.target.value;
};

const handleEditBodyChange = (event) => {
  editBody.value = event.target.value;
};

const loadPost = async () => {
  if (!userId.value) {
    return;
  }

  isLoading.value = true;

  try {
    posts.value = await getPosts(userId.value);
  } catch (e) {
    errorMessagePosts.value = "Failed to load posts. Please refresh the page";
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (!loginInput.value) {
    errorMessageLogin.value = "Email is required";
    return;
  }

  loadingLogin.value = true;
  errorMessageLogin.value = "";

  try {
    const res = await getMe(loginInput.value);

    if (res.length === 0) {
      showReg.value = true;
    }

    userId.value = res[0].id;
    name.value = res[0].name;
    localStorage.setItem("userId", userId.value);

    await loadPost();
  } catch (e) {
    errorMessageLogin.value = "User not found. Check your email";
  } finally {
    loadingLogin.value = false;
  }
};

const handleSubmitReg = async () => {
  if (!userName.value) {
    errorMessageRegister.value = "Name is required";
    return;
  }

  loadingRegister.value = true;

  try {
    const newUser = await registerUser(loginInput.value, userName.value);
    userId.value = newUser.id;
    name.value = newUser.name;

    localStorage.setItem("userId", userId.value);

    showReg.value = false;

    await loadPost();
  } catch (e) {
    errorMessageRegister.value = "Registration failed. Please try again";
  } finally {
    loadingRegister.value = false;
  }
};

const logout = () => {
  localStorage.removeItem("userId");
  posts.value = [];
  userId.value = null;
};

const addNewPost = async () => {
  if (!title.value) {
    errorTitle.value = "Title is required";
  }

  if (!body.value) {
    errorBody.value = "Body is required";
  }

  if (!title.value || !body.value) {
    return;
  }

  loadingWriteComment.value = true;

  try {
    const newPost = await addPost(userId.value, title.value, body.value);

    posts.value.push(newPost);

    currentPost.value = newPost;
    comments.value = [];

    showAddPost.value = false;
  } catch (e) {
    errorWriteComment.value = "Failed to create post. Please try again";
  } finally {
    loadingWriteComment.value = false;
    title.value = "";
    body.value = "";
    errorTitle.value = "";
    errorBody.value = "";
  }
};

const cancelAddPost = async () => {
  showAddPost.value = false;

  title.value = "";
  body.value = "";

  errorBody.value = "";
  errorTitle.value = "";

  if (currentPost.value) {
    comments.value = await getComments(currentPost.value.id);
  }
};

const showFormAddPost = () => {
  currentPost.value = null;
  showUpdatePost.value = false;

  comments.value = [];

  showAddPost.value = true;
};

const getUser = async (post) => {
  showAddPost.value = false;
  showUpdatePost.value = false;

  if (currentPost.value?.id === post.id) {
    currentPost.value = null;
    comments.value = [];
    return;
  }

  loadingComments.value = true;
  currentPost.value = post;
  errorMessageComments.value = "";

  try {
    comments.value = await getComments(post.id);
  } catch (e) {
    errorMessageComments.value = "Failed to load comments. Please try again";
  } finally {
    loadingComments.value = false;
  }
};

const deleteCurrentPost = async () => {
  try {
    await deletePost(currentPost.value?.id);

    await loadPost();
  } catch (e) {
    errorMessageDeletePost.value = "Failed to delete post. Please try again";
  } finally {
    currentPost.value = null;
  }
};

const deleteCurrentComment = async (commentId) => {
  const deletedIndex = comments.value.findIndex(
    (comment) => comment.id === commentId,
  );
  const deletedComment = comments.value[deletedIndex];

  comments.value = comments.value.filter((comment) => comment.id !== commentId);

  try {
    await deleteComment(commentId);
  } catch {
    comments.value.splice(deletedIndex, 0, deletedComment);

    errorMessageDeleteComment.value = "Failed to delete comment";
  }
};

const addNewComment = async () => {
  errorMessageAuthorName.value = "";
  errorMessageAuthorEmail.value = "";
  errorMessageAuthorBody.value = "";
  commentWriteError.value = "";

  if (!authorName.value) {
    errorMessageAuthorName.value = "Name is required";
  }

  if (!authorEmail.value) {
    errorMessageAuthorEmail.value = "Email is required";
  }

  if (!authorBody.value) {
    errorMessageAuthorBody.value = "Body is required";
  }

  if (!authorName.value || !authorEmail.value || !authorBody.value) {
    return;
  }

  loadingAddComment.value = true;

  try {
    const newComment = await addComment(
      currentPost.value.id,
      authorName.value,
      authorEmail.value,
      authorBody.value,
    );

    comments.value.push(newComment);

    authorBody.value = "";

    errorMessageAuthorName.value = "";
    errorMessageAuthorEmail.value = "";
    errorMessageAuthorBody.value = "";
    commentWriteError.value = "";
  } catch (e) {
    commentWriteError.value = "Failed to add comment. Please try again";
  } finally {
    loadingAddComment.value = false;
  }
};

const showCommentForm = () => {
  writeComment.value = true;
};

const cancelWriteComment = () => {
  writeComment.value = false;

  errorMessageAuthorEmail.value = "";
  errorMessageAuthorName.value = "";
  errorMessageAuthorBody.value = "";
  commentWriteError.value = "";
};

const editCurrentPost = () => {
  if (!currentPost.value) {
    return;
  }

  showAddPost.value = false;

  editingPost.value = currentPost.value;

  editTitle.value = currentPost.value.title;
  editBody.value = currentPost.value.body;

  currentPost.value = null;

  showUpdatePost.value = true;
};

const updateCurrentPost = async () => {
  loadingPostEditing.value = true;

  try {
    const updatedPost = await updatePost(
      editTitle.value,
      editBody.value,
      editingPost.value.id,
      editingPost.value.userId,
    );

    await loadPost();

    comments.value = await getComments(updatedPost.id);
    currentPost.value = updatedPost;
  } catch (e) {
    errorMessageEditPost.value = "Failed to save changes. Please try again";
  } finally {
    loadingPostEditing.value = false;
    editTitle.value = "";
    editBody.value = "";

    showUpdatePost.value = false;

    editingPost.value = null;
  }
};

const resetUpdateCurrentPost = async () => {
  currentPost.value = editingPost.value;

  showUpdatePost.value = false;

  editTitle.value = "";
  editBody.value = "";

  try {
    comments.value = await getComments(currentPost.value.id);
  } catch (e) {
    errorMessageResetEdit.value = "Failed to reload comments after canceling";
  }

  editingPost.value = null;
};

onMounted(loadPost);
</script>

<template>
  <div v-if="userId">
    <AppNavbar :user-name="name" @logout="logout" />

    <div class="container">
      <div
        class="posts-layout"
        :class="{
          'posts-layout--open': currentPost || showUpdatePost || showAddPost,
        }"
      >
        <PostsList
          :posts="posts"
          :current-post="currentPost"
          :is-loading="isLoading"
          :error-message-posts="errorMessagePosts"
          @add-post="showFormAddPost"
          @select-post="getUser"
        />

        <div
          class="is-flex is-justify-content-center is-align-items-center mt-2"
          v-if="isLoading"
        >
          <div class="box">
            <Loader />
          </div>
        </div>

        <Transition name="sidebar">
          <div
            v-if="currentPost && !showUpdatePost"
            class="tile is-parent Sidebar box is-success"
            :class="{ 'Sidebar--open': currentPost }"
          >
            <PostDetails
              :post="currentPost"
              :comments="comments"
              :loading-comments="loadingComments"
              :error-message-comments="errorMessageComments"
              :write-comment="writeComment"
              :author-name="authorName"
              :author-email="authorEmail"
              :author-body="authorBody"
              :error-message-author-name="errorMessageAuthorName"
              :error-message-author-email="errorMessageAuthorEmail"
              :error-message-author-body="errorMessageAuthorBody"
              :comment-write-error="commentWriteError"
              :error-message-delete-post="errorMessageDeletePost"
              :error-message-edit-post="errorMessageEditPost"
              :error-message-delete-comment="errorMessageDeleteComment"
              :loading-add-comment="loadingAddComment"
              @edit-post="editCurrentPost"
              @delete-post="deleteCurrentPost"
              @delete-comment="deleteCurrentComment"
              @write-comment="showCommentForm"
              @add-comment="addNewComment"
              @cancel-write-comment="cancelWriteComment"
              @author-name-input="handleAuthorNameChange"
              @author-email-input="handleAuthorEmailChange"
              @author-body-input="handleAuthorBodyChange"
            />
          </div>
        </Transition>

        <Transition name="sidebar">
          <div
            class="tile is-parent Sidebar box is-success"
            :class="{ 'Sidebar--open': showUpdatePost }"
            v-if="showUpdatePost"
          >
            <PostEditForm
              :edit-title="editTitle"
              :edit-body="editBody"
              :loading-post-editing="loadingPostEditing"
              :error-message-reset-edit="errorMessageResetEdit"
              @submit="updateCurrentPost"
              @cancel="resetUpdateCurrentPost"
              @title-input="handleEditTitleChange"
              @body-input="handleEditBodyChange"
            />
          </div>
        </Transition>

        <Transition name="sidebar">
          <div
            v-if="showAddPost"
            class="tile is-parent Sidebar Sidebar--open box is-success"
          >
            <NewPostForm
              :title="title"
              :body="body"
              :error-title="errorTitle"
              :error-body="errorBody"
              :loading-write-comment="loadingWriteComment"
              :error-write-comment="errorWriteComment"
              @submit="addNewPost"
              @cancel="cancelAddPost"
              @title-input="handleTitleChange"
              @body-input="handleBodyChange"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <section v-else class="container is-flex is-justify-content-center">
    <LoginForm
      v-if="showReg === false"
      :login-input="loginInput"
      :error-message-login="errorMessageLogin"
      :loading-login="loadingLogin"
      @submit="handleSubmit"
      @input="handleLoginChange"
    />

    <RegisterForm
      v-if="showReg === true"
      :login-input="loginInput"
      :user-name="userName"
      :error-message-register="errorMessageRegister"
      :loading-register="loadingRegister"
      @submit="handleSubmitReg"
      @input="handleUserNameChange"
    />
  </section>
</template>

<style scoped>
.posts-layout {
  display: flex;
  width: 100%;
  gap: 24px;
  align-items: flex-start;
}

.PostsBlock {
  flex: 1;
  transition: all 0.45s ease;
}

.posts-layout--open .PostsBlock {
  flex: 0 0 calc(50% - 12px);
}

.Sidebar {
  flex: 0 0 0;
  width: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateX(40px);
  transition:
    flex 0.45s ease,
    opacity 0.35s ease,
    transform 0.35s ease;
}

.Sidebar--open {
  flex: 0 0 calc(50% - 12px);
  width: auto;
  opacity: 1;
  transform: translateX(0);
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
  transform: translateX(60px);
}

.sidebar-enter-to,
.sidebar-leave-from {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 768px) {
  .posts-layout {
    flex-direction: column;
  }

  .PostsBlock,
  .Sidebar,
  .Sidebar--open {
    width: 100%;
    flex: 1;
  }
}
</style>