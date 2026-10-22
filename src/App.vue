<script setup>
import { onMounted, ref } from 'vue';
import { api } from './api';
import AuthForm from './components/AuthForm.vue';
import Loader from './components/Loader.vue';
import PostForm from './components/PostForm.vue';
import PostDetails from './components/PostDetails.vue';
const STORAGE_KEY = 'vue-posts-user';
function restoreUser() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && Number.isInteger(saved.id) && saved.id > 0 && typeof saved.name === 'string' && typeof saved.email === 'string' ? saved : null;
  } catch { return null; }
}
const user = ref(restoreUser());
const posts = ref([]);
const loading = ref(false);
const postsError = ref(false);
const selected = ref(null);
const mode = ref('');
const busy = ref(false);
const actionError = ref('');
let loadVersion = 0;
async function loadPosts() {
  const version = ++loadVersion;
  loading.value = true; postsError.value = false;
  try {
    const result = await api.getPosts(user.value.id);
    if (version === loadVersion) posts.value = result;
  } catch { if (version === loadVersion) postsError.value = true; }
  finally { if (version === loadVersion) loading.value = false; }
}
function login(value) {
  user.value = value;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* Storage may be unavailable. */ }
  loadPosts();
}
function close() {
  if (busy.value) return;
  selected.value = null; mode.value = ''; actionError.value = '';
}
function logout() {
  if (busy.value) return;
  ++loadVersion;
  close(); user.value = null; posts.value = []; loading.value = false;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* No persistent session. */ }
}
function open(post) {
  if (busy.value) return;
  if (selected.value?.id === post.id && mode.value === 'preview') { close(); return; }
  selected.value = post; mode.value = 'preview'; actionError.value = '';
}
function create() { close(); mode.value = 'create'; }
async function save(data) {
  if (busy.value) return;
  busy.value = true; actionError.value = '';
  try {
    const saved = mode.value === 'create'
      ? await api.createPost({ ...data, userId: user.value.id })
      : await api.updatePost(selected.value.id, data);
    if (mode.value === 'create') posts.value.push(saved);
    else posts.value = posts.value.map(post => post.id === saved.id ? saved : post);
    selected.value = saved; mode.value = 'preview';
  } catch { actionError.value = 'Unable to save the post. Please try again.'; }
  finally { busy.value = false; }
}
async function removePost() {
  if (busy.value) return;
  busy.value = true; actionError.value = '';
  try {
    await api.deletePost(selected.value.id);
    posts.value = posts.value.filter(post => post.id !== selected.value.id);
    selected.value = null; mode.value = '';
  } catch { actionError.value = 'Unable to delete the post. Please try again.'; }
  finally { busy.value = false; }
}
function edit() { actionError.value = ''; mode.value = 'edit'; }
function cancelForm() { actionError.value = ''; if (mode.value === 'edit') mode.value = 'preview'; else close(); }
onMounted(() => { if (user.value) loadPosts(); });
</script>
<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item"><h2 class="is-size-4">Vue List Of Posts</h2></div>
    <div v-if="user" class="navbar-end"><div class="navbar-item">
      <div class="buttons"><div class="mr-5 mb-2"><p>User: {{ user.name }}</p></div>
        <button type="button" class="button is-light" :disabled="busy" @click="logout">Logout</button>
      </div>
    </div></div>
  </nav>
  <AuthForm v-if="!user" @login="login" />
  <main v-else class="section">
    <div class="container"><div class="tile is-ancestor">
      <div class="tile is-parent"><div class="tile is-child box is-success">
        <div class="block">
          <div class="block is-flex is-justify-content-space-between">
            <p class="title">Posts</p>
            <button type="button" class="button is-link" :disabled="busy || loading || postsError" @click="create">Create new post</button>
          </div>
          <Loader v-if="loading" />
          <div v-else-if="postsError" class="notification is-danger" data-cy="PostsError" role="alert">
            Unable to load posts. <button type="button" class="button is-small" @click="loadPosts">Try again</button>
          </div>
          <p v-else-if="!posts.length" class="notification is-info" data-cy="NoPosts">No posts yet</p>
          <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow" data-cy="PostsList">
            <thead><tr class="has-background-link-light"><th>ID</th><th>Title</th><th class="has-text-right">Actions</th></tr></thead>
            <tbody><tr v-for="post in posts" :key="post.id" :class="{ 'is-selected': selected?.id === post.id }">
              <td>{{ post.id }}</td><td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered"><button type="button" class="button is-link" :disabled="busy" @click="open(post)">{{ selected?.id === post.id && mode === 'preview' ? 'Close' : 'Open' }}</button></td>
            </tr></tbody>
          </table>
        </div>
      </div></div>
      <aside class="tile is-parent is-8-desktop Sidebar" :class="{ 'Sidebar--open': mode }" :aria-hidden="!mode" aria-label="Post details">
        <div v-if="mode" class="tile is-child box is-success">
          <button type="button" class="delete is-pulled-right mb-3" aria-label="Close sidebar" :disabled="busy" @click="close"></button>
          <PostForm v-if="mode === 'create' || mode === 'edit'" :key="`${mode}-${selected?.id || ''}`" :post="mode === 'edit' ? selected : null" :busy="busy" :error="actionError" @save="save" @cancel="cancelForm" />
          <PostDetails v-else-if="selected" :key="selected.id" :post="selected" :busy="busy" :error="actionError" @edit="edit" @delete="removePost" />
        </div>
      </aside>
    </div></div>
  </main>
</template>
