<script setup>
import { ref } from "vue";
import Loader from "./components/Loader.vue";
import CommentForm from "./components/CommentForm.vue";
import { getUserByEmail, createUser } from "./api/users";
import {
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
  getCommentsByPost,
  createComment,
  deleteComment,
} from "./api/posts";

const email = ref("");
const name = ref("");
const user = ref(null);
const error = ref("");
const isRegistering = ref(false);
const isLoading = ref(false);
const posts = ref([]);
const postsLoading = ref(false);
const postsError = ref("");
const showPostForm = ref(false);
const postTitle = ref("");
const postBody = ref("");
const postCreating = ref(false);
const postError = ref("");
const selectedPost = ref(null);
const isEditingPost = ref(false);
const editPostTitle = ref("");
const editPostBody = ref("");
const postUpdating = ref(false);
const postDeleting = ref(false);
const deletePostError = ref("");
const editPostError = ref("");
const showSidebar = ref(false);
const comments = ref([]);
const commentsLoading = ref(false);
const commentsError = ref("");
const commentCreating = ref(false);
const commentError = ref("");
const commentSuccessCount = ref(0);
const showCommentForm = ref(false);

async function openPost(post) {
  selectedPost.value = post;
  showPostForm.value = false;
  showSidebar.value = true;
  showCommentForm.value = false;

  commentError.value = "";

  comments.value = [];
  commentsError.value = "";
  commentsLoading.value = true;

  try {
    const response = await getCommentsByPost(post.id);
    comments.value = response.data;
  } catch {
    commentsError.value = "Could not load comments. Please try again.";
  } finally {
    commentsLoading.value = false;
  }
}

function startCreatingPost() {
  selectedPost.value = null;
  showSidebar.value = true;
  showPostForm.value = true;
  showCommentForm.value = false;
  isEditingPost.value = false;

  postTitle.value = "";
  postBody.value = "";
  postError.value = "";
}

function cancelCreatingPost() {
  showPostForm.value = false;
  showSidebar.value = false;
  postError.value = "";
}

function startEditingPost() {
  editPostTitle.value = selectedPost.value.title;
  editPostBody.value = selectedPost.value.body;
  editPostError.value = "";
  isEditingPost.value = true;
}

function cancelEditingPost() {
  isEditingPost.value = false;
  editPostError.value = "";
}

async function handleUpdatePost() {
  editPostError.value = "";
  postUpdating.value = true;

  try {
    const response = await updatePost(selectedPost.value.id, {
      title: editPostTitle.value,
      body: editPostBody.value,
    });

    selectedPost.value = response.data;

    const index = posts.value.findIndex(
      (post) => post.id === selectedPost.value.id,
    );

    if (index !== -1) {
      posts.value[index] = response.data;
    }

    isEditingPost.value = false;
  } catch {
    editPostError.value = "Could not update post. Please try again.";
  } finally {
    postUpdating.value = false;
  }
}

async function handleDeletePost() {
  deletePostError.value = "";
  postDeleting.value = true;

  try {
    await deletePost(selectedPost.value.id);

    posts.value = posts.value.filter(
      (post) => post.id !== selectedPost.value.id,
    );

    selectedPost.value = null;
    showSidebar.value = false;
    showCommentForm.value = false;
    isEditingPost.value = false;
  } catch {
    deletePostError.value = "Could not delete post. Please try again.";
  } finally {
    postDeleting.value = false;
  }
}

async function handleCreateComment(commentData) {
  commentError.value = "";
  commentCreating.value = true;

  try {
    const response = await createComment({
      postId: selectedPost.value.id,
      name: commentData.name,
      email: commentData.email,
      body: commentData.body,
    });

    comments.value.push(response.data);
    commentSuccessCount.value += 1;
  } catch {
    commentError.value = "Could not create comment. Please try again.";
  } finally {
    commentCreating.value = false;
  }
}

async function handleDeleteComment(commentId) {
  const previousComments = [...comments.value];

  comments.value = comments.value.filter((comment) => comment.id !== commentId);

  try {
    await deleteComment(commentId);
  } catch {
    comments.value = previousComments;
    commentError.value = "Could not delete comment. Please try again.";
  }
}

async function loadPosts(userId) {
  postsLoading.value = true;
  postsError.value = "";

  try {
    const response = await getPostsByUser(userId);
    posts.value = response.data;
  } catch {
    postsError.value = "Could not load posts. Please try again.";
  } finally {
    postsLoading.value = false;
  }
}

async function handleCreatePost() {
  postError.value = "";
  postCreating.value = true;

  try {
    const response = await createPost({
      userId: user.value.id,
      title: postTitle.value,
      body: postBody.value,
    });

    const newPost = response.data;

    posts.value.push(newPost);
    postTitle.value = "";
    postBody.value = "";
    showPostForm.value = false;

    openPost(newPost);
  } catch {
    postError.value = "Could not create post. Please try again.";
  } finally {
    postCreating.value = false;
  }
}

async function handleLogin() {
  error.value = "";
  isLoading.value = true;

  try {
    const response = await getUserByEmail(email.value);
    const users = response.data;
    console.log("Users from API:", response.data);

    if (users.length > 0) {
      user.value = users[0];
      await loadPosts(user.value.id);
    } else {
      isRegistering.value = true;
    }
  } catch {
    error.value = "Could not load user. Please try again.";
  } finally {
    isLoading.value = false;
  }
}

async function handleRegister() {
  error.value = "";
  isLoading.value = true;

  try {
    const response = await createUser({
      name: name.value,
      email: email.value,
    });

    user.value = response.data;
    await loadPosts(user.value.id);
  } catch {
    error.value = "Could not register user. Please try again.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <section class="container is-flex is-justify-content-center">
    <form
      v-if="!user"
      class="box mt-5 login-box"
      @submit.prevent="isRegistering ? handleRegister() : handleLogin()"
    >
      <h1 class="title is-3">
        {{ isRegistering ? "You need to register" : "Login" }}
      </h1>

      <div class="field">
        <label class="label" for="user-email">Email</label>
        <div class="control">
          <input
            id="user-email"
            v-model="email"
            class="input"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div v-if="isRegistering" class="field">
        <label class="label" for="user-name">Your Name</label>
        <div class="control">
          <input
            id="user-name"
            v-model="name"
            class="input"
            type="text"
            placeholder="Enter your name"
            minlength="4"
            required
          />
        </div>
      </div>

      <p v-if="error" class="help is-danger mb-3">
        {{ error }}
      </p>

      <button
        class="button is-primary"
        :class="{ 'is-loading': isLoading }"
        type="submit"
        :disabled="isLoading"
      >
        {{ isRegistering ? "Register" : "Login" }}
      </button>
    </form>

    <div v-else class="container mt-5 posts-page">
      <div class="columns">
        <div class="column" :class="showSidebar ? 'is-4' : 'is-12'">
          <div class="box">
            <div class="block is-flex is-justify-content-space-between">
              <p class="title">Posts</p>
              <button
                type="button"
                class="button is-link"
                @click="startCreatingPost"
              >
                Add New Post
              </button>
            </div>

            <div v-if="postsLoading">
              <Loader />
            </div>
            <div v-else-if="postsError" class="notification is-danger">
              {{ postsError }}
            </div>
            <p v-else-if="posts.length === 0">No posts yet</p>

            <table
              v-else
              class="table is-fullwidth is-striped is-hoverable is-narrow"
            >
              <thead>
                <tr class="has-background-link-light">
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
                    <button
                      type="button"
                      class="button is-link"
                      @click="openPost(post)"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
  v-if="showSidebar && showPostForm"
  class="column is-8"
>
  <div class="tile is-parent Sidebar Sidebar--open post-sidebar">
    <div class="tile is-child box">
      <div class="content">
        <div class="is-flex is-justify-content-space-between">
          <h2 class="title is-4">Add a new post</h2>

          <button
            type="button"
            class="delete"
            aria-label="Close"
            @click="cancelCreatingPost"
          ></button>
        </div>

        <form
          class="post-form"
          @submit.prevent="handleCreatePost"
        >
          <div class="field">
            <label class="label" for="post-title">Title</label>
            <input
              id="post-title"
              v-model="postTitle"
              class="input"
              type="text"
              required
            />
          </div>

          <div class="field">
            <label class="label" for="post-body">Body</label>
            <textarea
              id="post-body"
              v-model="postBody"
              class="textarea"
              required
            ></textarea>
          </div>

          <p v-if="postError" class="help is-danger mb-3">
            {{ postError }}
          </p>

          <div class="field is-grouped">
            <button
              type="submit"
              class="button is-link"
              :class="{ 'is-loading': postCreating }"
              :disabled="postCreating"
            >
              Create
            </button>

            <button
              type="button"
              class="button is-light"
              :disabled="postCreating"
              @click="cancelCreatingPost"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

        <div v-if="showSidebar && selectedPost" class="column is-8">
          <div class="tile is-parent Sidebar Sidebar--open post-sidebar">
            <div class="tile is-child box">
              <div class="content">
                <div class="is-flex is-justify-content-space-between">
                  <h2>#{{ selectedPost.id }}: {{ selectedPost.title }}</h2>
                  <button
                    type="button"
                    class="delete"
                    aria-label="Close"
                    @click="showSidebar = false"
                  ></button>
                </div>

                <div v-if="!isEditingPost">
                  <p>{{ selectedPost.body }}</p>

                  <div class="buttons mt-3">
                    <button
                      type="button"
                      class="button is-info is-small"
                      @click="startEditingPost"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      class="button is-danger is-small"
                      :class="{ 'is-loading': postDeleting }"
                      :disabled="postDeleting"
                      @click="handleDeletePost"
                    >
                      Delete
                    </button>
                  </div>

                  <p v-if="deletePostError" class="help is-danger">
                    {{ deletePostError }}
                  </p>
                </div>

                <form
                  v-else
                  class="post-form"
                  @submit.prevent="handleUpdatePost"
                >
                  <div class="field">
                    <label class="label">Title</label>
                    <input
                      v-model="editPostTitle"
                      class="input"
                      type="text"
                      required
                    />
                  </div>

                  <div class="field">
                    <label class="label">Body</label>
                    <textarea
                      v-model="editPostBody"
                      class="textarea"
                      required
                    ></textarea>
                  </div>

                  <p v-if="editPostError" class="has-text-danger mb-3">
                    {{ editPostError }}
                  </p>

                  <button
                    type="submit"
                    class="button is-success"
                    :class="{ 'is-loading': postUpdating }"
                    :disabled="postUpdating"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    class="button is-light ml-2"
                    :disabled="postUpdating"
                    @click="cancelEditingPost"
                  >
                    Cancel
                  </button>
                </form>
              </div>

              <hr />

              <h3 class="title is-5">Comments</h3>

              <div v-if="commentsLoading">
                <Loader />
              </div>

              <div v-else-if="commentsError" class="notification is-danger">
                {{ commentsError }}
              </div>

              <p v-else-if="comments.length === 0">No comments yet</p>

              <div v-else>
                <article
                  v-for="comment in comments"
                  :key="comment.id"
                  class="message is-light"
                >
                  <div class="message-body">
                    <strong>{{ comment.name }}</strong>
                    <p>{{ comment.body }}</p>
                    <small>{{ comment.email }}</small>

                    <div class="has-text-right mt-2">
                      <button
                        type="button"
                        class="button is-danger is-small"
                        @click="handleDeleteComment(comment.id)"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              </div>

              <div class="mt-4">
                <button
                  v-if="!showCommentForm"
                  type="button"
                  class="button is-link"
                  @click="showCommentForm = true"
                >
                  Write a comment
                </button>

                <CommentForm
                  v-if="showCommentForm"
                  :is-loading="commentCreating"
                  :error="commentError"
                  :success-count="commentSuccessCount"
                  @submit="handleCreateComment"
                  @cancel="showCommentForm = false"
                  @clear-error="commentError = ''"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
