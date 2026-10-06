<script setup>
import { onMounted, ref } from 'vue';
import CommentForm from './components/CommentForm.vue';
import Loader from './components/Loader.vue';
import PostForm from './components/PostForm.vue';
import CommentsList from './components/CommentsList.vue';
const API_URL = 'https://mate-academy.github.io/fe-students-api';
const USER_ID = 1;

const posts = ref([]);
const loading = ref(false);
const error = ref('');
const submittingComment = ref(false);
const selectedPost = ref(null);
const comments = ref([]);
const commentsLoading = ref(false);
const commentsError = ref('');

const showCreateForm = ref(false);
const showCommentForm = ref(false);
const editing = ref(false);

async function loadPosts() {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch(
      `${API_URL}/posts?userId=${USER_ID}`,
    );

    if (!response.ok) {
      throw new Error('Failed to load posts');
    }

    posts.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function selectPost(post) {
  selectedPost.value = post;
  editing.value = false;
  showCreateForm.value = false;
  showCommentForm.value = false;

  await loadComments(post.id);
}

async function loadComments(postId) {
  commentsLoading.value = true;
  commentsError.value = '';
  comments.value = [];

  try {
    const response = await fetch(
      `${API_URL}/comments?postId=${postId}`,
    );

    if (!response.ok) {
      throw new Error('Failed to load comments');
    }

    comments.value = await response.json();
  } catch (err) {
    commentsError.value = err.message;
  } finally {
    commentsLoading.value = false;
  }
}

function openCreateForm() {
  selectedPost.value = null;
  editing.value = false;
  showCommentForm.value = false;
  showCreateForm.value = true;
}

async function createPost(postData) {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: USER_ID,
        title: postData.title,
        body: postData.body,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    const newPost = await response.json();

    posts.value.push(newPost);

    selectedPost.value = newPost;
    showCreateForm.value = false;
    editing.value = false;
    showCommentForm.value = false;

    comments.value = [];
    commentsError.value = '';
    await loadComments(newPost.id);
  } catch (err) {
    error.value = err.message;
  }
}

function editPost() {
  editing.value = true;
  showCreateForm.value = false;
}

async function savePost(postData) {
  try {
    const response = await fetch(
      `${API_URL}/posts/${selectedPost.value.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postData.title,
          body: postData.body,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    const updatedPost = await response.json();

    const index = posts.value.findIndex(
      post => post.id === updatedPost.id,
    );

    if (index !== -1) {
      posts.value[index] = updatedPost;
    }

    selectedPost.value = updatedPost;
    editing.value = false;
  } catch (err) {
    error.value = err.message;
  }
}

async function deletePost() {
  try {
    const response = await fetch(
      `${API_URL}/posts/${selectedPost.value.id}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    posts.value = posts.value.filter(
      post => post.id !== selectedPost.value.id,
    );

    closeSidebar();
  } catch (err) {
    error.value = err.message;
  }
}

function openCommentForm() {
  showCommentForm.value = true;
}

async function addComment(comment) {
  commentsError.value = '';
  submittingComment.value = true;


  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: selectedPost.value.id,
        name: comment.name,
        email: comment.email,
        body: comment.body,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    const newComment = await response.json();

    comments.value.push(newComment);

    comment.clearBody();
  } catch (err) {
    commentsError.value = err.message;
  } finally {
    submittingComment.value = false;
  }
}

async function deleteComment(comment) {
  // Remove immediately for better UX
  comments.value = comments.value.filter(
    item => item.id !== comment.id,
  );

  try {
    const response = await fetch(
      `${API_URL}/comments/${comment.id}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  } catch (err) {
    commentsError.value = err.message;
  }
}

function closeSidebar() {
  selectedPost.value = null;
  showCreateForm.value = false;
  editing.value = false;
  showCommentForm.value = false;
  comments.value = [];
  commentsError.value = '';
}

onMounted(loadPosts);
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="title">Posts</h1>

      <button
        class="button is-primary mb-4"
        @click="openCreateForm"
      >
        Create new post
      </button>

      <Loader v-if="loading" />

      <div
        v-else-if="error"
        class="notification is-danger"
      >
        {{ error }}
      </div>

      <div
        v-else-if="posts.length === 0"
        class="notification is-warning"
      >
        No posts yet
      </div>

      <table
        v-else
        class="table is-fullwidth is-hoverable"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
            style="cursor: pointer"
            @click="selectPost(post)"
          >
            <td>{{ post.id }}</td>
            <td>{{ post.title }}</td>
            <td>{{ post.body }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sidebar -->
    <aside
      v-if="selectedPost || showCreateForm"
      class="box Sidebar--open"
      style="
        position: fixed;
        top: 0;
        right: 0;
        width: 450px;
        height: 100vh;
        overflow-y: auto;
        margin: 0;
        border-radius: 0;
        z-index: 10;
      "
    >
      <button
        class="delete is-large is-pulled-right"
        @click="closeSidebar"
      ></button>

      <!-- CREATE POST -->
      <div v-if="showCreateForm">
        <h2 class="title is-4">
          Create new post
        </h2>

        <PostForm @submit="createPost" />
      </div>

      <!-- SELECTED POST -->
      <div v-else-if="selectedPost">

        <!-- EDIT POST -->
        <div v-if="editing">
          <h2 class="title is-4">
            Edit post
          </h2>

          <PostForm
            :post="selectedPost"
            @submit="savePost"
          />
        </div>

        <!-- POST PREVIEW -->
        <div v-else>
          <h2 class="title is-4">
            {{ selectedPost.title }}
          </h2>

          <div class="content">
            {{ selectedPost.body }}
          </div>

          <div class="buttons">
            <button
              class="button is-warning"
              @click="editPost"
            >
              Edit
            </button>

            <button
              class="button is-danger"
              @click="deletePost"
            >
              Delete
            </button>
          </div>

          <hr />

          <h3 class="title is-5">
            Comments
          </h3>

          <!-- COMMENTS LOADING -->
          <Loader v-if="commentsLoading" />

          <!-- COMMENTS ERROR -->
          <div
            v-else-if="commentsError"
            class="notification is-danger"
          >
            {{ commentsError }}
          </div>

          <!-- NO COMMENTS -->
          <div
            v-else-if="comments.length === 0"
            class="notification is-light"
          >
            No comments yet
          </div>

          <!-- COMMENTS -->
          <CommentsList
            :comments="comments"
            @delete="deleteComment"
          />

          <!-- WRITE COMMENT BUTTON -->
          <div v-if="!showCommentForm">
            <button
              class="button is-link"
              @click="openCommentForm"
            >
              Write a comment
            </button>
          </div>

          <!-- COMMENT FORM -->
          <div
            v-else
            class="mt-4"
          >
            <CommentForm
  :submitting="submittingComment"
  @submit="addComment"
/>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>