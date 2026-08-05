<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { api, type Comment, type Post, type User } from './api';
import Loader from './components/Loader.vue';
import CommentForm from './components/CommentForm.vue';

const currentUser = ref<User | null>(null);
const users = ref<User[]>([]);
const posts = ref<Post[]>([]);
const selectedPost = ref<Post | null>(null);
const comments = ref<Comment[]>([]);
const isPostsLoading = ref(false);
const isCommentsLoading = ref(false);
const postsError = ref('');
const commentsError = ref('');
const actionError = ref('');
const sidebarMode = ref<'closed' | 'preview' | 'create' | 'edit'>('closed');
const showCommentForm = ref(false);
const postForm = reactive({ title: '', body: '' });
const postErrors = reactive({ title: '', body: '' });
const isPostSaving = ref(false);
const login = reactive({ email: '', name: '' });
const loginError = ref('');
const needsRegistration = ref(false);

const isSidebarOpen = computed(() => sidebarMode.value !== 'closed');

const loadPosts = async () => {
  if (!currentUser.value) return;
  isPostsLoading.value = true;
  postsError.value = '';
  try {
    posts.value = await api.getPosts(currentUser.value.id);
  } catch {
    postsError.value = 'Unable to load posts';
  } finally {
    isPostsLoading.value = false;
  }
};

onMounted(async () => {
  const saved = localStorage.getItem('vue-posts-user');
  if (saved) currentUser.value = JSON.parse(saved);
  try { users.value = await api.getUsers(); } catch { loginError.value = 'Unable to load users'; }
  if (currentUser.value) await loadPosts();
});

watch(currentUser, user => {
  if (user) localStorage.setItem('vue-posts-user', JSON.stringify(user));
  else localStorage.removeItem('vue-posts-user');
});

const handleLogin = async () => {
  loginError.value = '';
  const found = users.value.find(user => user.email.toLowerCase() === login.email.toLowerCase());
  if (found) { currentUser.value = found; await loadPosts(); return; }
  if (!needsRegistration.value) { needsRegistration.value = true; return; }
  if (login.name.trim().length < 4) { loginError.value = 'Name should contain at least 4 characters'; return; }
  try {
    const user = await api.createUser({ name: login.name.trim(), email: login.email.trim() });
    currentUser.value = user;
    users.value.push(user);
    await loadPosts();
  } catch { loginError.value = 'Unable to register'; }
};

const logout = () => { currentUser.value = null; posts.value = []; selectedPost.value = null; sidebarMode.value = 'closed'; };
const openCreate = () => { postForm.title = ''; postForm.body = ''; postErrors.title = ''; postErrors.body = ''; sidebarMode.value = 'create'; };
const openEdit = () => { if (!selectedPost.value) return; postForm.title = selectedPost.value.title; postForm.body = selectedPost.value.body; sidebarMode.value = 'edit'; };

const openPost = async (post: Post) => {
  selectedPost.value = post;
  sidebarMode.value = 'preview';
  showCommentForm.value = false;
  comments.value = [];
  commentsError.value = '';
  isCommentsLoading.value = true;
  try { comments.value = await api.getComments(post.id); }
  catch { commentsError.value = 'Unable to load comments'; }
  finally { isCommentsLoading.value = false; }
};

const savePost = async () => {
  postErrors.title = postForm.title.trim() ? '' : 'Title is required';
  postErrors.body = postForm.body.trim() ? '' : 'Body is required';
  if (postErrors.title || postErrors.body || !currentUser.value) return;
  isPostSaving.value = true;
  actionError.value = '';
  try {
    if (sidebarMode.value === 'edit' && selectedPost.value) {
      const updated = await api.updatePost({ ...selectedPost.value, ...postForm });
      posts.value = posts.value.map(post => post.id === updated.id ? updated : post);
      selectedPost.value = updated;
    } else {
      const created = await api.createPost({ userId: currentUser.value.id, ...postForm });
      posts.value.push(created);
      selectedPost.value = created;
      comments.value = [];
    }
    sidebarMode.value = 'preview';
  } catch { actionError.value = 'Unable to save post. Please try again.'; }
  finally { isPostSaving.value = false; }
};

const deletePost = async () => {
  if (!selectedPost.value) return;
  const id = selectedPost.value.id;
  actionError.value = '';
  try { await api.deletePost(id); posts.value = posts.value.filter(post => post.id !== id); selectedPost.value = null; sidebarMode.value = 'closed'; }
  catch { actionError.value = 'Unable to delete post. Please try again.'; }
};

const deleteComment = async (comment: Comment) => {
  comments.value = comments.value.filter(item => item.id !== comment.id);
  try { await api.deleteComment(comment.id); }
  catch { comments.value.push(comment); actionError.value = 'Unable to delete comment. Please try again.'; }
};
</script>

<template>
  <div data-cy="App">
    <section v-if="!currentUser" class="container is-flex is-justify-content-center">
      <form class="box mt-5 login-box" data-cy="LoginForm" @submit.prevent="handleLogin">
        <h1 class="title is-3">You need to register</h1>
        <div class="field"><label class="label" for="user-email">Email</label><div class="control has-icons-left"><input id="user-email" v-model="login.email" required type="email" class="input" placeholder="Enter your email" /><span class="icon is-small is-left"><i class="fas fa-envelope" /></span></div></div>
        <div v-if="needsRegistration" class="field"><label class="label" for="user-name">Your Name</label><div class="control has-icons-left"><input id="user-name" v-model="login.name" required minlength="4" class="input" placeholder="Enter your name" /><span class="icon is-small is-left"><i class="fas fa-user" /></span></div></div>
        <p v-if="loginError" class="help is-danger">{{ loginError }}</p>
        <button type="submit" class="button is-primary">{{ needsRegistration ? 'Register' : 'Login' }}</button>
      </form>
    </section>

    <template v-else>
      <nav class="navbar" role="navigation"><div class="navbar-item"><h1 class="is-size-4">Vue List Of Posts</h1></div><div class="navbar-end"><div class="navbar-item"><div class="buttons"><p class="mr-5 mb-2">User: {{ currentUser.name }}</p><button type="button" class="button is-light" @click="logout">Logout</button></div></div></div></nav>
      <main class="container py-5"><div class="tile is-ancestor">
        <div class="tile is-parent"><div class="tile is-child box"><div class="is-flex is-justify-content-space-between mb-5"><h2 class="title">Posts</h2><button type="button" class="button is-link" @click="openCreate">Add New Post</button></div>
          <Loader v-if="isPostsLoading" />
          <p v-else-if="postsError" class="notification is-danger" data-cy="PostsError">{{ postsError }} <button class="button is-small" @click="loadPosts">Retry</button></p>
          <p v-else-if="posts.length === 0" class="notification is-info" data-cy="NoPostsYet">No posts yet</p>
          <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow" data-cy="PostsList"><thead><tr class="has-background-link-light"><th>ID</th><th>Title</th><th class="has-text-right">Actions</th></tr></thead><tbody><tr v-for="post in posts" :key="post.id" :class="{ 'is-selected': selectedPost?.id === post.id }"><td>{{ post.id }}</td><td>{{ post.title }}</td><td class="has-text-right"><button type="button" class="button is-link" @click="openPost(post)">Open</button></td></tr></tbody></table>
        </div></div>

        <aside class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': isSidebarOpen }"><div class="tile is-child box"><div v-if="sidebarMode === 'create' || sidebarMode === 'edit'" class="content" data-cy="PostForm"><h2>{{ sidebarMode === 'create' ? 'Create new post' : 'Edit post' }}</h2><form @submit.prevent="savePost"><div class="field"><label class="label">Title</label><input v-model="postForm.title" class="input" :class="{ 'is-danger': postErrors.title }" @input="postErrors.title = ''" /><p v-if="postErrors.title" class="help is-danger">{{ postErrors.title }}</p></div><div class="field"><label class="label">Body</label><textarea v-model="postForm.body" class="textarea" :class="{ 'is-danger': postErrors.body }" @input="postErrors.body = ''" /><p v-if="postErrors.body" class="help is-danger">{{ postErrors.body }}</p></div><div class="field is-grouped"><button class="button is-link" :class="{ 'is-loading': isPostSaving }">{{ sidebarMode === 'create' ? 'Create' : 'Save' }}</button><button type="button" class="button is-link is-light" @click="sidebarMode = selectedPost ? 'preview' : 'closed'">Cancel</button></div></form></div>
          <div v-else-if="selectedPost" data-cy="PostDetails"><div class="is-flex is-justify-content-space-between is-align-items-center"><h2>#{{ selectedPost.id }}: {{ selectedPost.title }}</h2><div><button class="button is-small is-link is-light mr-2" @click="openEdit"><i class="fas fa-pen-to-square" /></button><button class="button is-small is-danger is-light" @click="deletePost"><i class="fas fa-trash" /></button></div></div><p data-cy="PostBody">{{ selectedPost.body }}</p><hr />
            <Loader v-if="isCommentsLoading" /><p v-else-if="commentsError" class="notification is-danger" data-cy="CommentsError">{{ commentsError }}</p><p v-else-if="comments.length === 0" class="title is-4" data-cy="NoComments">No comments yet</p><article v-for="comment in comments" v-else :key="comment.id" class="message is-small" data-cy="Comment"><div class="message-header"><a :href="`mailto:${comment.email}`">{{ comment.name }}</a><button type="button" class="delete is-small" aria-label="delete" @click="deleteComment(comment)" /></div><div class="message-body">{{ comment.body }}</div></article>
            <CommentForm v-if="showCommentForm" :post-id="selectedPost.id" @added="comments.push($event)" /><button v-else type="button" class="button is-link" @click="showCommentForm = true">Write a comment</button>
          </div><p v-else class="has-text-grey">Select a post or create a new one</p><p v-if="actionError" class="notification is-danger mt-4">{{ actionError }}</p></div></aside>
      </div></main>
    </template>
  </div>
</template>
