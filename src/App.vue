<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { User } from '@/types/User';
import type { Post } from '@/types/Post';
import { client } from '@/api/fetchClient';
import LoginForm from './components/LoginForm.vue';
import AppHeader from './components/AppHeader.vue';
import PostsList from './components/PostsList.vue';
import PostDetails from './components/PostDetails.vue';
import PostForm from './components/PostForm.vue';
import Loader from './components/Loader.vue';

const STORAGE_KEY = 'loggedInUser';

const user = ref<User | null>(null);
const posts = ref<Post[]>([]);
const postsLoading = ref(false);
const postsError = ref(false);
const selectedPostId = ref<number | null>(null);
const showNewPostForm = ref(false);

function loadUserFromStorage(): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.id === 'number' && typeof parsed.name === 'string') {
        user.value = parsed;
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

function saveUserToStorage(u: User): void {
  user.value = u;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
}

function clearUser(): void {
  user.value = null;
  localStorage.removeItem(STORAGE_KEY);
  posts.value = [];
  selectedPostId.value = null;
  showNewPostForm.value = false;
}

async function loadPosts(userId: number): Promise<void> {
  postsLoading.value = true;
  postsError.value = false;
  posts.value = [];
  selectedPostId.value = null;
  showNewPostForm.value = false;

  try {
    const data = await client.get<Post[]>(`/posts?userId=${userId}`);
    if (user.value?.id === userId) {
      posts.value = data;
      postsLoading.value = false;
    }
  } catch {
    if (user.value?.id === userId) {
      postsError.value = true;
      postsLoading.value = false;
    }
  }
}

function handleLogin(u: User): void {
  saveUserToStorage(u);
  loadPosts(u.id);
}

function handleLogout(): void {
  clearUser();
}

function handleAddNewPost(): void {
  showNewPostForm.value = true;
  selectedPostId.value = null;
}

function handlePostSelect(postId: number | null): void {
  selectedPostId.value = postId;
  showNewPostForm.value = false;
}

function handleSidebarClose(): void {
  selectedPostId.value = null;
  showNewPostForm.value = false;
}

function handlePostSaved(savedPost: Post): void {
  if (showNewPostForm.value) {
    posts.value = [savedPost, ...posts.value];
  } else {
    const idx = posts.value.findIndex((p) => p.id === savedPost.id);
    if (idx !== -1) posts.value[idx] = savedPost;
  }
  selectedPostId.value = savedPost.id;
  showNewPostForm.value = false;
}

function handlePostDeleted(postId: number): void {
  posts.value = posts.value.filter((p) => p.id !== postId);
  selectedPostId.value = null;
  showNewPostForm.value = false;
}

function handlePostFormCancel(): void {
  showNewPostForm.value = false;
}

const selectedPost = computed(() =>
  selectedPostId.value ? posts.value.find((p) => p.id === selectedPostId.value) || null : null
);

const showSidebar = computed(() => selectedPostId.value !== null || showNewPostForm.value);
const showPostsContent = computed(() => user.value !== null);
const showLogin = computed(() => user.value === null);

onMounted(() => {
  loadUserFromStorage();
  if (user.value) {
    loadPosts(user.value.id);
  }
});
</script>

<template>
  <main class="section">
    <div class="container">
      <LoginForm v-if="showLogin" @login="handleLogin" />

      <div v-if="showPostsContent">
        <AppHeader :user="user!" @logout="handleLogout" />

        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child box is-success">
              <div class="block" data-cy="MainContent">
                <Loader v-if="postsLoading" />

                <div v-if="postsError" class="notification is-danger" data-cy="PostsLoadingError">
                  Something went wrong!
                </div>

                <PostsList
                  v-if="!postsLoading && !postsError"
                  :posts="posts"
                  :selected-post-id="selectedPostId"
                  @select="handlePostSelect"
                  @add-new="handleAddNewPost"
                />
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            class="tile is-parent is-8-desktop Sidebar"
            :class="{ 'Sidebar--open': showSidebar }"
          >
            <div class="tile is-child box is-success">
              <PostForm
                v-if="showNewPostForm"
                :user-id="user!.id"
                @save="handlePostSaved"
                @cancel="handlePostFormCancel"
              />

              <PostDetails
                v-else-if="selectedPost"
                :post="selectedPost"
                @deleted="handlePostDeleted"
                @updated="handlePostSaved"
                @close="handleSidebarClose"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

@media (min-width: 769px) {
  .Sidebar {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;
}

@media (min-width: 769px) {
  .Sidebar--open {
    max-width: 50%;
  }
}

.message-body {
  white-space: pre-line;
}
</style>