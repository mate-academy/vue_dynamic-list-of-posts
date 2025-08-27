<template>
  <div>
    <!-- ===== LOGIN SCREEN ===== -->
    <section v-if="!user" class="container is-flex is-justify-content-center mt-5">
      <form @submit.prevent="login" class="box" style="max-width: 275px; width: 100%">
        <h1 class="title is-3" style="color: var(--color-heading)">Get your userId</h1>

        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left" :class="{ 'has-icons-right': errors.loginEmail }">
            <input
              v-model.trim="email"
              type="email"
              class="input"
              :class="{ 'is-danger': errors.loginEmail }"
              name="email"
              placeholder="Enter your email"
              @input="validateLoginEmail"
            />
            <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
            <span v-if="errors.loginEmail" class="icon is-small is-right">
              <i class="fas fa-exclamation-triangle"></i>
            </span>
          </div>
          <p v-if="errors.loginEmail" class="help is-danger">A valid email is required</p>
        </div>

        <p v-if="loginError" class="has-text-danger mb-2">{{ loginError }}</p>

        <div class="field">
          <button type="submit" class="button is-primary" :class="{ 'is-loading': loggingIn }">
            Login
          </button>
        </div>
      </form>
    </section>

    <!-- ===== POSTS SCREEN ===== -->
    <div v-else>
      <nav class="navbar is-light" role="navigation" style="background-color: white">
        <div class="navbar-brand">
          <h2 class="is-size-4 ml-5 mt-3 has-text-weight-semibold" style="color: var(--color-heading)">
            Vue List Of Posts
          </h2>
        </div>
        <div class="navbar-end mr-3">
          <div class="navbar-item">
            <div class="buttons">
              <p class="mr-5">User: {{ user.name }}</p>
              <button class="button is-light logout-btn" @click="logout">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div class="tile is-ancestor mt-6" style="max-width: 1400px; margin: 0 auto">
        <div class="tile is-parent is-4-desktop ml-5">
          <div class="tile is-child box" style="background-color: var(--color-background-soft); border-color: var(--color-border)">
            <div class="block is-flex is-justify-content-space-between">
              <p class="title" style="color: var(--color-heading)">Posts</p>
              <button
                type="button"
                class="button"
                :class="creatingPost ? 'is-link is-inverted' : 'is-link'"
                :style="creatingPost ? { backgroundColor: 'rgba(0, 0, 255, 0.05)' } : {}"
                @click="createNewPost"
              >
                Add New Post
              </button>
            </div>

            <!-- Loader для постов -->
            <div v-if="loadingPosts">
              <Loader />
            </div>

            <!-- Ошибка загрузки постов -->
            <div v-else-if="errorPosts" class="notification is-danger">
              {{ errorPosts }}
              <button class="delete" @click="errorPosts = ''"></button>
            </div>

            <!-- Таблица постов -->
            <table
              class="table is-fullwidth is-striped is-hoverable is-narrow"
              v-else-if="posts.length > 0"
            >
              <thead>
                <tr style="background-color: rgba(0, 0, 255, 0.05)">
                  <th class="has-text-weight-bold">ID</th>
                  <th class="has-text-weight-bold">Title</th>
                  <th class="has-text-right has-text-weight-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in posts" :key="post.id">
                  <td>{{ post.id }}</td>
                  <td>{{ post.title }}</td>
                  <td class="has-text-right">
                    <button
                      class="button"
                      :class="selectedPost && selectedPost.id === post.id && sidebarOpen ? 'is-link' : 'is-link is-inverted'"
                      :style="selectedPost && selectedPost.id === post.id && sidebarOpen ? {} : { backgroundColor: 'rgba(0, 0, 255, 0.05)' }"
                      @click="togglePost(post)"
                    >
                      {{ selectedPost && selectedPost.id === post.id && sidebarOpen ? 'Close' : 'Open' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <p v-else class="has-text-centered">No posts yet</p>
          </div>
        </div>

        <!-- ===== SIDEBAR ===== -->
        <Sidebar :open="sidebarOpen">
          <!-- Просмотр выбранного поста -->
          <template v-if="selectedPost">
            <PostPreview :post="selectedPost" @edit="editPost" @delete="deletePost" />

            <!-- Loader для комментариев -->
            <div v-if="loadingComments">
              <Loader />
            </div>

            <!-- Ошибка загрузки комментариев -->
            <div v-else-if="errorComments" class="notification is-danger">
              {{ errorComments }}
              <button class="button is-small is-light ml-3" @click="loadComments(selectedPost.id)">
                Retry
              </button>
            </div>

            <!-- Комментарии -->
            <div v-else>
              <!-- Сообщение "Нет комментариев" -->
              <div v-if="comments.length === 0" class="block has-text-weight-semibold is-size-4 has-text-left">
                No comments yet
              </div>

              <CommentForm
                v-if="showCommentForm"
                :postId="selectedPost.id"
                @comment-submit="attemptAddComment"
                @cancel="cancelCommentForm"
              />
              <button v-else class="button is-link mt-2" @click="showCommentForm = true">
                Write a comment
              </button>

              <!-- Список комментариев -->
              <div v-for="comment in comments" :key="comment._id || comment.id" class="message is-small mt-2">
                <div class="message-header">
                  <a :href="`mailto:${comment.email}`">{{ comment.name }}</a>
                  <button type="button" class="delete is-small" @click="attemptDeleteComment(comment)"></button>
                </div>
                <div class="message-body">
                  {{ comment.body }}
                  <!-- Ошибка добавления комментария -->
                  <div v-if="comment.addError" class="notification is-danger mt-1">
                    Failed to add comment.
                    <button class="button is-small is-light ml-2" @click="retryAddComment(comment)">Retry</button>
                  </div>
                  <!-- Ошибка удаления комментария -->
                  <div v-if="comment.deleteError" class="notification is-danger mt-1">
                    Failed to delete comment.
                    <button class="button is-small is-light ml-2" @click="retryDeleteComment(comment)">Retry</button>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Создание / редактирование поста -->
          <template v-else-if="creatingPost">
            <h2 class="title is-4" style="color: var(--color-heading)">Create new post</h2>
            <form @submit.prevent="savePost">
              <div class="field">
                <label class="label">Title</label>
                <div class="control has-icons-left" :class="{ 'has-icons-right': errors.newPostTitle }">
                  <input
                    class="input"
                    :class="{ 'is-danger': errors.newPostTitle }"
                    v-model.trim="newPost.title"
                    placeholder="Post title"
                    @input="validatePostField('title')"
                  />
                  <span class="icon is-small is-left"><i class="fa-solid fa-user"></i></span>
                  <span v-if="errors.newPostTitle" class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle has-text-danger"></i>
                  </span>
                </div>
                <p v-if="errors.newPostTitle" class="help is-danger">Title is required</p>
              </div>

              <div class="field">
                <label class="label">Write Post Body</label>
                <div class="control" :class="{ 'has-icons-right': errors.newPostBody }">
                  <textarea
                    class="textarea"
                    :class="{ 'is-danger': errors.newPostBody }"
                    v-model.trim="newPost.body"
                    placeholder="Post Body"
                    @input="validatePostField('body')"
                  ></textarea>
                  <span v-if="errors.newPostBody" class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle has-text-danger"></i>
                  </span>
                </div>
                <p v-if="errors.newPostBody" class="help is-danger">Body is required</p>
              </div>

              <div class="field is-grouped">
                <div class="control">
                  <button type="submit" class="button is-link" :class="{ 'is-loading': savingPost }">Save</button>
                </div>
                <div class="control">
                  <button type="button" class="button is-link is-inverted" style="background-color: rgba(0, 0, 255, 0.05)" @click="cancelCreate">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </template>
        </Sidebar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Loader from './components/Loader.vue';
import CommentForm from './components/CommentForm.vue';
import PostPreview from './components/PostPreview.vue';
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePostApi,
  fetchComments,
  deleteCommentApi,
  addCommentApi,
  fetchUserByEmail,
} from './api/index.js';

// STATE
const email = ref('');
const user = ref(null);
const loginError = ref('');
const loggingIn = ref(false);

const posts = ref([]);
const loadingPosts = ref(false);
const errorPosts = ref('');

const selectedPost = ref(null);
const sidebarOpen = ref(false);
const comments = ref([]);
const loadingComments = ref(false);
const errorComments = ref('');
const showCommentForm = ref(false);
const creatingPost = ref(false);
const newPost = ref({ title: '', body: '' });
const savingPost = ref(false);

const errors = reactive({
  loginEmail: false,
  newPostTitle: false,
  newPostBody: false,
});

// VALIDATION
const validateLoginEmail = () => {
  errors.loginEmail = !email.value || !/\S+@\S+\.\S+/.test(email.value);
};

const validatePostFields = () => {
  let isValid = true;
  if (!newPost.value.title) { errors.newPostTitle = true; isValid = false; }
  if (!newPost.value.body) { errors.newPostBody = true; isValid = false; }
  return isValid;
};

const validatePostField = (field) => {
  if (field === 'title') errors.newPostTitle = !newPost.value.title;
  if (field === 'body') errors.newPostBody = !newPost.value.body;
};

const clearErrors = () => {
  errors.loginEmail = false;
  errors.newPostTitle = false;
  errors.newPostBody = false;
  loginError.value = '';
  errorComments.value = '';
};

// LOGIN & LOGOUT
async function login() {
  clearErrors();
  validateLoginEmail();
  if (errors.loginEmail) return;

  loggingIn.value = true;
  try {
    const foundUser = await fetchUserByEmail(email.value);
    if (!foundUser) { loginError.value = 'User not found'; return; }
    user.value = foundUser;
    email.value = '';
    await loadPosts();
  } catch {
    loginError.value = 'Error during login. Please try again.';
  } finally {
    loggingIn.value = false;
  }
}

function logout() {
  user.value = null;
  posts.value = [];
  selectedPost.value = null;
  sidebarOpen.value = false;
  email.value = '';
  clearErrors();
}

// POSTS
async function loadPosts() {
  loadingPosts.value = true;
  errorPosts.value = '';
  try { posts.value = await fetchPosts(user.value.id); }
  catch { errorPosts.value = 'Failed to load posts.'; }
  finally { loadingPosts.value = false; }
}

function createNewPost() {
  creatingPost.value = true;
  sidebarOpen.value = true;
  newPost.value = { title: '', body: '' };
  selectedPost.value = null;
  clearErrors();
}

function cancelCreate() {
  creatingPost.value = false;
  sidebarOpen.value = false;
  newPost.value = { title: '', body: '' };
  clearErrors();
}

async function savePost() {
  clearErrors();
  if (!validatePostFields()) return;
  savingPost.value = true;
  try {
    let post;
    if (newPost.value.id) {
      post = await updatePost(newPost.value);
      const index = posts.value.findIndex((p) => p.id === post.id);
      if (index !== -1) posts.value[index] = post;
    } else {
      post = await createPost({ ...newPost.value, userId: user.value.id });
      posts.value.unshift(post);
    }
    selectedPost.value = post;
    creatingPost.value = false;
    loadComments(post.id);
  } finally { savingPost.value = false; }
}

function togglePost(post) {
  if (selectedPost.value && selectedPost.value.id === post.id && sidebarOpen.value) {
    selectedPost.value = null;
    sidebarOpen.value = false;
  } else {
    selectedPost.value = post;
    sidebarOpen.value = true;
    creatingPost.value = false;
    loadComments(post.id);
  }
}

async function deletePost(postId) {
  posts.value = posts.value.filter((p) => p.id !== postId);
  selectedPost.value = null;
  sidebarOpen.value = false;
  try { await deletePostApi(postId); } catch {}
}

function editPost(post) {
  creatingPost.value = true;
  newPost.value = { ...post };
  selectedPost.value = null;
  sidebarOpen.value = true;
  clearErrors();
}

// COMMENTS
async function loadComments(postId) {
  loadingComments.value = true;
  comments.value = [];
  errorComments.value = '';
  try { comments.value = await fetchComments(postId); }
  catch { errorComments.value = 'Failed to load comments.'; }
  finally { loadingComments.value = false; }
}

function cancelCommentForm() { showCommentForm.value = false; }

// ====== Оптимистичное удаление комментария с Retry ======
async function attemptDeleteComment(comment) {
  comment._optimisticDeleted = true;
  try {
    await deleteCommentApi(comment.id);
    comments.value = comments.value.filter(c => c.id !== comment.id);
  } catch {
    comment._optimisticDeleted = false;
    comment.deleteError = true;
  }
}

async function retryDeleteComment(comment) {
  comment.deleteError = false;
  await attemptDeleteComment(comment);
}

// ====== Оптимистичное добавление комментария с Retry ======
async function attemptAddComment(comment) {
  const tempComment = { ...comment, _optimistic: true, _id: Date.now() };
  comments.value.push(tempComment);
  showCommentForm.value = false;

  try {
    const savedComment = await addCommentApi({ ...comment, postId: selectedPost.value.id });
    const index = comments.value.findIndex(c => c._id === tempComment._id);
    if (index !== -1) comments.value[index] = savedComment;
  } catch {
    tempComment._optimistic = false;
    tempComment.addError = true;
  }
}

async function retryAddComment(comment) {
  comment.addError = false;
  await attemptAddComment({ name: comment.name, email: comment.email, body: comment.body });
}

// LIFECYCLE
onMounted(() => { if (user.value) loadPosts(); });
</script>

<style scoped>
.tile.is-ancestor { gap: 1rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-5 { margin-top: 1.5rem; }
</style>
