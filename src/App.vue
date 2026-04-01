<script setup lang="ts">
import { ref } from 'vue';
import { User } from './types/User';
import { Post } from './types/Post';
import client from './utils/http';
import Login from './components/login.vue';
import Header from './blocks/header.vue';
import PostsList from './components/postsList.vue';
import Sidebar from './components/sidebar.vue';
import Loader from './components/loader.vue';
import './App.scss';

const currentUser = ref<User | null>(null);
const posts = ref<Post[]>([]);
const selectedPost = ref<Post | null>(null);
const isLoadingPosts = ref(false);
const isAddingPost = ref(false);
const postsError = ref<string | null>(null);
  const deleteError = ref<string | null>(null); 

const handleLogin = async (user: User) => {
  currentUser.value = user;
  isLoadingPosts.value = true;
  postsError.value = null;
  selectedPost.value = null;
  posts.value = [];
  try {
    const response = await client.get<Post[]>(`/posts?userId=${user.id}`);
    posts.value = response.data;
  } catch {
    postsError.value = 'Failed to load posts. Please try again later.';
  } finally {
    isLoadingPosts.value = false;
  }
};

const handleLogout = () => {
  currentUser.value = null;
  posts.value = [];
  selectedPost.value = null;
  isAddingPost.value = false;
  postsError.value = null;
};

const togglePost = (post: Post) => {
  if (selectedPost.value?.id === post.id) {
    selectedPost.value = null;
  } else {
    selectedPost.value = post;
    isAddingPost.value = false;
  }
};

const openAddPost = () => {
  isAddingPost.value = true;
  selectedPost.value = null;
};

const closeSidebar = () => {
  selectedPost.value = null;
  isAddingPost.value = false;
};

const handlePostAdded = (newPost: Post) => {
  posts.value.push(newPost);
  isAddingPost.value = false;
  selectedPost.value = newPost;
};

const handlePostDelete = async (postId: number) => {
  deleteError.value = null;

  // 1. Зберігаємо копії для rollback
  const previousPosts = [...posts.value];
  const previousSelected = selectedPost.value;

  // 2. Одразу оновлюємо UI (optimistic update)
  posts.value = posts.value.filter(p => p.id !== postId);
  if (selectedPost.value?.id === postId) {
    selectedPost.value = null;
  }

  // 3. Запит на сервер
  try {
    await client.delete(`/posts/${postId}`);
  } catch {
    // 4. Якщо помилка — rollback і показуємо повідомлення
    posts.value = previousPosts;
    selectedPost.value = previousSelected;
    deleteError.value = 'Failed to delete post. Please try again.';
  }
};

const handlePostEdit = async (updatedPost: Post) => {
  try {
    const response = await client.patch<Post>(`/posts/${updatedPost.id}`, {
      title: updatedPost.title,
      body: updatedPost.body,
    });
    const index = posts.value.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) posts.value[index] = response.data;
    if (selectedPost.value?.id === updatedPost.id) selectedPost.value = response.data;
  } catch {
    console.error('Failed to update post');
  }
};
</script>

<template>
  <Login v-if="currentUser === null" @login="handleLogin" />

  <template v-else>
    <Header :user="currentUser" @logout="handleLogout" />

    <main class="section">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">

              <div class="block is-flex is-justify-content-space-between">
                <p class="title">Posts</p>
                <button
                  type="button"
                  class="button is-link"
                  data-cy="CreateNewPostButton"
                  @click="openAddPost"
                >
                  Add New Post
                </button>
              </div>

              <Loader v-if="isLoadingPosts" />

              <template v-else>
                <div
                  v-if="postsError"
                  class="notification is-danger"
                  data-cy="PostsLoadingError"
                >
                  {{ postsError }}
                </div>

                <div
                  v-else-if="posts.length === 0"
                  class="notification is-warning"
                  data-cy="NoPostsYet"
                >
                  No posts yet.
                </div>

                <PostsList
                  v-if="posts.length > 0"
                  :posts="posts"
                  :selectedPostId="selectedPost ? selectedPost.id : null"
                  @select="togglePost"
                />
              </template>

            </div>
          </div>
        </div>

        <Sidebar
          :selectedPost="selectedPost"
          :isAdding="isAddingPost"
          :userId="currentUser.id"
          @close="closeSidebar"
          @post-added="handlePostAdded"
          @delete="handlePostDelete"
          @edit="handlePostEdit"
        />

      </div>
    </main>
  </template>
</template>