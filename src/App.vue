<script setup>
import { ref, watch } from 'vue';
import { createPost, deletePost, getPosts, updatePost } from './api';
import AppHeader from './components/AppHeader.vue';
import LoginForm from './components/LoginForm.vue';
import PostDetails from './components/PostDetails.vue';
import PostForm from './components/PostForm.vue';
import PostsList from './components/PostsList.vue';
import Sidebar from './components/Sidebar.vue';

const STORAGE_KEY = 'posts-app-user';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

const user = ref(readStoredUser());
const posts = ref([]);
const postsLoading = ref(false);
const postsError = ref(false);

const selectedPost = ref(null);
const mode = ref('closed'); // closed | create | edit | view
const saving = ref(false);
const formError = ref('');
const deleteError = ref('');

async function loadPosts() {
  const userId = user.value?.id;

  postsLoading.value = true;
  postsError.value = false;

  try {
    const result = await getPosts(userId);

    if (user.value?.id === userId) {
      posts.value = result;
    }
  } catch {
    postsError.value = true;
  } finally {
    postsLoading.value = false;
  }
}

function closeSidebar() {
  selectedPost.value = null;
  mode.value = 'closed';
}

watch(
  user,
  (value) => {
    closeSidebar();
    posts.value = [];

    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      loadPosts();
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
  { immediate: true },
);

function openPost(post) {
  if (selectedPost.value?.id === post.id && mode.value !== 'create') {
    closeSidebar();

    return;
  }

  selectedPost.value = post;
  mode.value = 'view';
  deleteError.value = '';
}

function startCreate() {
  selectedPost.value = null;
  mode.value = 'create';
  formError.value = '';
}

function startEdit() {
  mode.value = 'edit';
  formError.value = '';
}

function cancelForm() {
  mode.value = selectedPost.value ? 'view' : 'closed';
}

async function submitPost(data) {
  saving.value = true;
  formError.value = '';

  try {
    if (mode.value === 'create') {
      const created = await createPost({ userId: user.value.id, ...data });

      posts.value.push(created);
      selectedPost.value = created;
    } else {
      const updated = await updatePost(selectedPost.value.id, data);
      const merged = { ...selectedPost.value, ...updated };

      posts.value = posts.value.map((post) =>
        post.id === merged.id ? merged : post,
      );
      selectedPost.value = merged;
    }

    mode.value = 'view';
  } catch {
    formError.value = 'Could not save the post. Please try again.';
  } finally {
    saving.value = false;
  }
}

async function removePost() {
  const { id } = selectedPost.value;

  deleteError.value = '';

  try {
    await deletePost(id);
    posts.value = posts.value.filter((post) => post.id !== id);
    closeSidebar();
  } catch {
    deleteError.value = 'Could not delete the post. Please try again.';
  }
}
</script>

<template>
  <AppHeader v-if="user" :user="user" @logout="user = null" />

  <LoginForm v-if="!user" @login="user = $event" />

  <main v-else class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <PostsList
          :posts="posts"
          :selected-id="selectedPost?.id ?? null"
          :loading="postsLoading"
          :error="postsError"
          @open="openPost"
          @add="startCreate"
          @retry="loadPosts"
        />

        <Sidebar :open="mode !== 'closed'">
          <PostForm
            v-if="mode === 'create' || mode === 'edit'"
            :key="`${mode}-${selectedPost?.id}`"
            :post="mode === 'edit' ? selectedPost : null"
            :saving="saving"
            :error="formError"
            @submit="submitPost"
            @cancel="cancelForm"
          />

          <PostDetails
            v-if="selectedPost"
            v-show="mode === 'view'"
            :key="selectedPost.id"
            :post="selectedPost"
            :error="deleteError"
            @edit="startEdit"
            @delete="removePost"
          />
        </Sidebar>
      </div>
    </div>
  </main>
</template>
