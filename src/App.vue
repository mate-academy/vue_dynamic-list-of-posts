<script setup>
import { onMounted, ref, watch } from "vue";
import Loader from "./components/Loader.vue";
import CommentForm from "./components/CommentForm.vue";
import {
  getUsers,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getComments,
  createComment,
  deleteComment,
} from "./api";

const users = ref([]);
const selectedUserId = ref("");
const posts = ref([]);
const comments = ref([]);
const selectedPost = ref(null);

const loadingUsers = ref(false);
const loadingPosts = ref(false);
const loadingComments = ref(false);
const savingPost = ref(false);
const deletingPost = ref(false);
const savingComment = ref(false);

const error = ref("");
const commentsError = ref("");
const commentFieldErrors = ref({
  name: "",
  email: "",
  body: "",
});

const clearBodyKey = ref(0);
const postError = ref("");
const commentError = ref("");

const sidebarOpen = ref(false);
const formMode = ref("");
const postForm = ref({ title: "", body: "" });
const commentFormOpen = ref(false);

async function loadUsers() {
  loadingUsers.value = true;
  error.value = "";

  try {
    const response = await getUsers();
    users.value = response.data;

    if (users.value.length) {
      selectedUserId.value = String(users.value[0].id);
    }
  } catch {
    error.value = "Could not load users. Please try again.";
  } finally {
    loadingUsers.value = false;
  }
}

async function loadPosts() {
  if (!selectedUserId.value) {
    posts.value = [];
    return;
  }

  loadingPosts.value = true;
  error.value = "";
  selectedPost.value = null;
  sidebarOpen.value = false;

  try {
    const response = await getPosts(Number(selectedUserId.value));
    posts.value = response.data;
  } catch {
    error.value = "Could not load posts. Please try again.";
    posts.value = [];
  } finally {
    loadingPosts.value = false;
  }
}

function openNewPost() {
  selectedPost.value = null;
  comments.value = [];
  postForm.value = { title: "", body: "" };
  postError.value = "";
  formMode.value = "create";
  sidebarOpen.value = true;
}

async function openPost(post) {
  selectedPost.value = { ...post };
  comments.value = [];
  commentsError.value = "";
  commentError.value = "";
  commentFormOpen.value = false;
  sidebarOpen.value = true;
  formMode.value = "preview";
  loadingComments.value = true;

  try {
    const response = await getComments(post.id);
    if (selectedPost.value?.id === post.id) {
      comments.value = response.data;
    }
  } catch {
    if (selectedPost.value?.id === post.id) {
      commentsError.value = "Could not load comments.";
    }
  } finally {
    if (selectedPost.value?.id === post.id) {
      loadingComments.value = false;
    }
  }
}

function editPost() {
  postForm.value = {
    title: selectedPost.value.title,
    body: selectedPost.value.body,
  };
  postError.value = "";
  formMode.value = "edit";
}

async function savePost() {
  postError.value = "";

  if (!postForm.value.title.trim() || !postForm.value.body.trim()) {
    postError.value = "Title and body are required.";
    return;
  }

  savingPost.value = true;

  try {
    if (formMode.value === "create") {
      const response = await createPost({
        userId: Number(selectedUserId.value),
        title: postForm.value.title.trim(),
        body: postForm.value.body.trim(),
      });

      posts.value.unshift(response.data);
      selectedPost.value = response.data;
      comments.value = [];
      formMode.value = "preview";
    } else {
      const response = await updatePost(selectedPost.value.id, {
        title: postForm.value.title.trim(),
        body: postForm.value.body.trim(),
      });

      const updatedPost = response.data;
      posts.value = posts.value.map((post) =>
        post.id === updatedPost.id ? updatedPost : post,
      );
      selectedPost.value = updatedPost;
      formMode.value = "preview";
    }
  } catch {
    postError.value = "Could not save the post. Please try again.";
  } finally {
    savingPost.value = false;
  }
}

async function removePost() {
  if (!selectedPost.value) {
    return;
  }

  const postId = selectedPost.value.id;
  deletingPost.value = true;
  postError.value = "";

  try {
    await deletePost(postId);
    posts.value = posts.value.filter((post) => post.id !== postId);
    closeSidebar();
  } catch {
    postError.value = "Could not delete the post. Please try again.";
  } finally {
    deletingPost.value = false;
  }
}

function closeSidebar() {
  sidebarOpen.value = false;
  selectedPost.value = null;
  comments.value = [];
  formMode.value = "";
  commentFormOpen.value = false;
}

function openCommentForm() {
  commentFormOpen.value = true;
  commentError.value = "";
  commentFieldErrors.value = {
    name: "",
    email: "",
    body: "",
  };
}

function clearCommentFieldError(field) {
  if (Object.hasOwn(commentFieldErrors.value, field)) {
    commentFieldErrors.value[field] = "";
  }

  commentError.value = "";
}
async function saveComment(form) {
  commentError.value = "";
  commentFieldErrors.value = {
    name: "",
    email: "",
    body: "",
  };

  const { name, email, body } = form;

  if (!name.trim()) {
    commentFieldErrors.value.name = "Name is required.";
  }

  if (!email.trim()) {
    commentFieldErrors.value.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    commentFieldErrors.value.email = "Enter a valid email address.";
  }

  if (!body.trim()) {
    commentFieldErrors.value.body = "Comment is required.";
  }

  if (
    Object.values(commentFieldErrors.value).some(
      (fieldError) => fieldError !== "",
    )
  ) {
    return;
  }

  if (!selectedPost.value) {
    return;
  }

  savingComment.value = true;

  try {
    const response = await createComment({
      postId: selectedPost.value.id,
      name: name.trim(),
      email: email.trim(),
      body: body.trim(),
    });

    comments.value.push(response.data);
    clearBodyKey.value += 1;
    commentFieldErrors.value = {
      name: "",
      email: "",
      body: "",
    };
  } catch {
    commentError.value = "Could not add comment. Please try again.";
  } finally {
    savingComment.value = false;
  }
}

async function removeComment(comment) {
  const deletedComment = comments.value.find((item) => item.id === comment.id);

  if (!deletedComment) {
    return;
  }

  comments.value = comments.value.filter((item) => item.id !== comment.id);

  commentsError.value = "";

  try {
    await deleteComment(comment.id);
  } catch {
    const alreadyExists = comments.value.some((item) => item.id === comment.id);

    if (!alreadyExists) {
      comments.value.push(deletedComment);
      comments.value.sort((a, b) => a.id - b.id);
    }

    commentsError.value =
      "Could not delete comment. The comment has been restored. Please try again.";
  }
}

watch(selectedUserId, loadPosts);
onMounted(loadUsers);
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Vue Dynamic List of Posts</h1>

      <div class="field">
        <label class="label" for="user-select">Select user</label>
        <div class="select">
          <select id="user-select" v-model="selectedUserId">
            <option
              v-for="user in users"
              :key="user.id"
              :value="String(user.id)"
            >
              {{ user.name }} ({{ user.username }})
            </option>
          </select>
        </div>
      </div>

      <Loader
        v-if="loadingUsers || loadingPosts"
        label="Loading users and posts..."
      />

      <div v-else-if="error" class="notification is-danger">
        {{ error }}
        <button
          class="button is-small"
          @click="selectedUserId ? loadPosts() : loadUsers()"
        >
          Retry
        </button>
      </div>

      <div v-else class="box">
        <div class="level">
          <div class="level-left">
            <h2 class="title is-4">Posts</h2>
          </div>
          <div class="level-right">
            <button class="button is-link" @click="openNewPost">
              Add New Post
            </button>
          </div>
        </div>

        <p v-if="!posts.length" class="notification is-light">No posts yet.</p>

        <table v-else class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right">
                <button class="button is-small is-link" @click="openPost(post)">
                  Open
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <div
    class="sidebar-backdrop"
    :class="{ 'Sidebar--open': sidebarOpen }"
    @click.self="closeSidebar"
  >
    <aside class="post-sidebar" :class="{ 'Sidebar--open': sidebarOpen }">
      <button
        class="delete sidebar-close"
        aria-label="Close sidebar"
        @click="closeSidebar"
      />

      <template v-if="formMode === 'create' || formMode === 'edit'">
        <h2 class="title is-4">
          {{ formMode === "create" ? "Create post" : "Edit post" }}
        </h2>

        <form @submit.prevent="savePost">
          <div class="field">
            <label class="label" for="post-title">Title</label>
            <div class="control">
              <input
                id="post-title"
                v-model="postForm.title"
                class="input"
                placeholder="Post title"
                required
              />
            </div>
          </div>

          <div class="field">
            <label class="label" for="post-body">Body</label>
            <div class="control">
              <textarea
                id="post-body"
                v-model="postForm.body"
                class="textarea"
                placeholder="Post body"
                required
              />
            </div>
          </div>

          <p v-if="postError" class="help is-danger mb-3">{{ postError }}</p>

          <div class="buttons">
            <button
              class="button is-link"
              :class="{ 'is-loading': savingPost }"
              :disabled="savingPost"
              type="submit"
            >
              {{ formMode === "create" ? "Create" : "Save" }}
            </button>
            <button
              class="button"
              type="button"
              :disabled="savingPost"
              @click="
                formMode === 'edit' ? (formMode = 'preview') : closeSidebar()
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </template>

      <template v-else-if="selectedPost">
        <h2 class="title is-4">Post #{{ selectedPost.id }}</h2>
        <h3 class="title is-5">{{ selectedPost.title }}</h3>
        <p class="mb-4">{{ selectedPost.body }}</p>

        <div class="buttons">
          <button class="button is-link" @click="editPost">Edit</button>
          <button
            class="button is-danger"
            :class="{ 'is-loading': deletingPost }"
            :disabled="deletingPost"
            @click="removePost"
          >
            Delete
          </button>
        </div>

        <p v-if="postError" class="help is-danger mb-3">{{ postError }}</p>

        <hr />
        <h3 class="title is-5">Comments</h3>

        <Loader v-if="loadingComments" label="Loading comments..." />

        <div v-else-if="commentsError" class="notification is-danger">
          {{ commentsError }}
          <button class="button is-small" @click="openPost(selectedPost)">
            Retry
          </button>
        </div>

        <p v-else-if="!comments.length" class="notification is-light">
          No comments yet.
        </p>

        <article
          v-for="comment in comments"
          :key="comment.id"
          class="message is-light"
        >
          <div class="message-header">
            <span>{{ comment.name }}</span>
            <button
              class="delete"
              aria-label="Delete comment"
              @click="removeComment(comment)"
            />
          </div>
          <div class="message-body">
            <p class="is-size-7 mb-2">{{ comment.email }}</p>
            {{ comment.body }}
          </div>
        </article>

        <template v-if="commentFormOpen">
          <CommentForm
            :loading="savingComment"
            :error="commentError"
            :field-errors="commentFieldErrors"
            :clear-body-key="clearBodyKey"
            @submit="saveComment"
            @field-change="clearCommentFieldError"
          />
        </template>

        <button
          v-else
          class="button is-link is-light mt-3"
          @click="openCommentForm"
        >
          Write a comment
        </button>
      </template>
    </aside>
  </div>
</template>
