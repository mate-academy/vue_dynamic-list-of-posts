<script setup>
import { computed, onMounted, ref } from 'vue';
import { request, USER_ID } from './api';
import Loader from './components/Loader.vue';
import PostForm from './components/PostForm.vue';
import CommentForm from './components/CommentForm.vue';

const user = ref(null);
const userError = ref(false);
const posts = ref([]);
const loading = ref(true);
const postsError = ref(false);
const selected = ref(null);
const mode = ref('closed');
const pending = ref(false);
const postError = ref('');
const comments = ref([]);
const commentsLoading = ref(false);
const commentsError = ref(false);
const commentForm = ref(false);
const failedDeletes = ref([]);
let commentsVersion = 0;
const sidebarOpen = computed(() => mode.value !== 'closed');

async function loadUser() {
  userError.value = false;
  try { user.value = await request(`/users/${USER_ID}`); }
  catch { userError.value = true; }
}

async function loadPosts() {
  loading.value = true;
  postsError.value = false;
  try { posts.value = await request(`/posts?userId=${USER_ID}`); }
  catch { postsError.value = true; }
  finally { loading.value = false; }
}

async function loadComments() {
  const version = ++commentsVersion;
  const id = selected.value.id;
  commentsLoading.value = true;
  commentsError.value = false;
  try {
    const result = await request(`/comments?postId=${id}`);
    if (version === commentsVersion) comments.value = result;
  } catch {
    if (version === commentsVersion) commentsError.value = true;
  } finally {
    if (version === commentsVersion) commentsLoading.value = false;
  }
}

function close() {
  ++commentsVersion;
  mode.value = 'closed'; selected.value = null; postError.value = '';
}

function open(post) {
  if (pending.value) return;
  if (selected.value?.id === post.id) {
    mode.value = 'preview'; postError.value = ''; return;
  }
  selected.value = post; mode.value = 'preview'; postError.value = '';
  comments.value = []; failedDeletes.value = []; commentForm.value = false;
  loadComments();
}

function create() {
  ++commentsVersion;
  selected.value = null; mode.value = 'create'; postError.value = '';
  commentForm.value = false; comments.value = []; failedDeletes.value = [];
}

async function savePost(fields) {
  pending.value = true; postError.value = '';
  const editing = mode.value === 'edit';
  try {
    const post = await request(editing ? `/posts/${selected.value.id}` : '/posts', editing ? 'PATCH' : 'POST', { ...fields, userId: USER_ID });
    if (editing) posts.value = posts.value.map(item => item.id === post.id ? post : item);
    else posts.value.push(post);
    selected.value = post; mode.value = 'preview';
    if (!editing) { comments.value = []; commentsLoading.value = false; commentsError.value = false; }
  } catch {
    postError.value = `Unable to ${editing ? 'save' : 'create'} the post. Please try again.`;
  } finally { pending.value = false; }
}

async function deletePost() {
  if (pending.value) return;
  pending.value = true; postError.value = '';
  try {
    await request(`/posts/${selected.value.id}`, 'DELETE');
    posts.value = posts.value.filter(post => post.id !== selected.value.id);
    close();
  } catch { postError.value = 'Unable to delete the post. Please try again.'; }
  finally { pending.value = false; }
}

async function deleteComment(comment) {
  const version = commentsVersion;
  // Keep the original collection for stable restoration after concurrent failures.
  const original = [...comments.value];
  comments.value = comments.value.filter(item => item.id !== comment.id);
  failedDeletes.value = failedDeletes.value.filter(id => id !== comment.id);
  try { await request(`/comments/${comment.id}`, 'DELETE'); }
  catch {
    if (version !== commentsVersion) return;
    const following = original.slice(original.findIndex(item => item.id === comment.id) + 1);
    const nextIndex = comments.value.findIndex(item => following.some(next => next.id === item.id));
    comments.value.splice(nextIndex < 0 ? comments.value.length : nextIndex, 0, comment);
    failedDeletes.value.push(comment.id);
  }
}

onMounted(() => { loadUser(); loadPosts(); });
</script>

<template>
  <nav class="navbar" aria-label="main navigation">
    <div class="navbar-item"><h1 class="is-size-4">Vue List Of Posts</h1></div>
    <div class="navbar-end"><div class="navbar-item">User: {{ user?.name || `#${USER_ID}` }}</div></div>
  </nav>
  <main class="section">
    <div v-if="userError" class="notification is-warning" role="alert">Unable to load the user. <button class="button is-small" @click="loadUser">Retry</button></div>
    <div class="tile is-ancestor">
      <section class="tile is-parent posts-panel">
        <div class="tile is-child box">
          <div class="block is-flex is-justify-content-space-between is-align-items-center">
            <h2 class="title mb-0">Posts</h2>
            <button class="button is-link" :disabled="pending || loading || postsError" @click="create">Create new post</button>
          </div>
          <Loader v-if="loading" />
          <div v-else-if="postsError" class="notification is-danger" role="alert" data-cy="PostsError">Unable to load posts. <button class="button is-small" @click="loadPosts">Retry</button></div>
          <p v-else-if="!posts.length" class="notification is-info" data-cy="NoPosts">No posts yet</p>
          <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow" data-cy="PostsList">
            <thead><tr class="has-background-link-light"><th>ID</th><th>Title</th><th class="has-text-right">Actions</th></tr></thead>
            <tbody><tr v-for="post in posts" :key="post.id" :class="{ 'is-selected': selected?.id === post.id }"><td>{{ post.id }}</td><td>{{ post.title }}</td><td class="has-text-right is-vcentered"><button class="button is-link" :disabled="pending" @click="open(post)">Open</button></td></tr></tbody>
          </table>
        </div>
      </section>
      <aside class="tile is-parent Sidebar" :class="{ 'Sidebar--open': sidebarOpen }" :aria-hidden="!sidebarOpen" aria-label="Post details">
        <div v-if="sidebarOpen" class="tile is-child box">
          <button class="delete is-pulled-right" aria-label="Close sidebar" :disabled="pending" @click="close"></button>
          <div class="content">
            <PostForm v-if="mode === 'create' || mode === 'edit'" :key="`${mode}-${selected?.id || 0}`" :post="mode === 'edit' ? selected : undefined" :pending="pending" :error="postError" @submit="savePost" @cancel="mode === 'edit' ? mode = 'preview' : close()" />
            <div v-if="selected" v-show="mode === 'preview'">
              <div class="block" data-cy="PostPreview">
                <h2>#{{ selected.id }}: {{ selected.title }}</h2>
                <div class="buttons"><button class="button is-small is-link is-light" :disabled="pending" @click="mode = 'edit'; postError = ''">Edit</button><button class="button is-small is-danger" :class="{ 'is-loading': pending }" :disabled="pending" @click="deletePost">Delete</button></div>
                <p class="post-body" data-cy="PostBody">{{ selected.body }}</p>
              </div>
              <p v-if="postError" class="notification is-danger" role="alert">{{ postError }}</p>
              <h3 class="title is-5">Comments</h3>
              <Loader v-if="commentsLoading" />
              <div v-else-if="commentsError" class="notification is-danger" role="alert" data-cy="CommentsError">Unable to load comments. <button class="button is-small" @click="loadComments">Retry</button></div>
              <template v-else>
                <p v-if="!comments.length" class="title is-4" data-cy="NoComments">No comments yet</p>
                <article v-for="comment in comments" :key="comment.id" class="message is-small" data-cy="Comment">
                  <div class="message-header"><a :href="`mailto:${comment.email}`">{{ comment.name }}</a><button class="delete is-small" :aria-label="`Delete comment by ${comment.name}`" @click="deleteComment(comment)"></button></div>
                  <div class="message-body">{{ comment.body }}</div>
                  <p v-if="failedDeletes.includes(comment.id)" class="notification is-danger" role="alert">Unable to delete this comment. <button class="button is-small" @click="deleteComment(comment)">Retry</button></p>
                </article>
                <CommentForm v-if="commentForm" :key="selected.id" :post-id="selected.id" @added="comments.push($event)" />
                <button v-else class="button is-link" @click="commentForm = true">Write a comment</button>
              </template>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>
