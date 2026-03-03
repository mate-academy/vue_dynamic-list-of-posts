<template>
  <nav class="navbar is-light" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ currentUser.name }}</p>
          </div>

          <a class="button is-light"> Logout </a>
        </div>
      </div>
    </div>
  </nav>

  <main class="section">
    <div class="container">
      <div class="columns">
        <div class="column" :class="{ 'is-8-desktop': sidebarOpen }">
          <div
            class="block is-flex is-justify-content-space-between is-align-items-center"
          >
            <p class="title">Posts</p>

            <button
              type="button"
              class="button is-link"
              @click="openCreateForm"
            >
              Add New Post
            </button>
          </div>

          <Loader v-if="isLoading" />

          <div v-else-if="loadError" class="notification is-danger">
            Failed to load posts
          </div>

          <div v-else-if="posts.length === 0" class="notification is-warning">
            No posts yet
          </div>

          <PostsList v-else :posts="posts" @openPost="openPost" />
        </div>

        <Sidebar :isOpen="sidebarOpen" @close="closeSidebar">
          <PostForm
            v-if="mode === 'create'"
            title="Create new post"
            @submit="handleCreatePost"
            @cancel="closeSidebar"
          />

          <div v-else-if="mode === 'view' && selectedPost">
            <div
              class="is-flex is-justify-content-space-between is-align-items-center"
            >
              <h2 class="title is-4">
                #{{ selectedPost.id }}: {{ selectedPost.title }}
              </h2>

              <div class="is-flex">
                <span
                  class="icon is-small is-clickable mr-3"
                  @click="mode = 'edit'"
                  title="Edit post"
                >
                  <i class="fas fa-pen-to-square"></i>
                </span>
                <span
                  class="icon is-small has-text-danger is-clickable"
                  @click="handleDeletePost"
                  title="Delete post"
                >
                  <i class="fas fa-trash"></i>
                </span>
              </div>
            </div>

            <p class="mt-3 content">{{ selectedPost.body }}</p>

            <hr />

            <CommentsList :postId="selectedPost.id" />
          </div>

          <PostForm
            v-else-if="mode === 'edit'"
            title="Edit post"
            :initialData="selectedPost"
            @submit="handleUpdatePost"
            @cancel="mode = 'view'"
          />
        </Sidebar>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { getPosts, createPost, updatePost, deletePost } from "./api/posts";

import PostsList from "./components/PostsList.vue";
import Sidebar from "./components/Sidebar.vue";
import Loader from "./components/Loader.vue";
import PostForm from "./components/PostForm.vue";
import CommentsList from "./components/CommentsList.vue";

const currentUser = ref({ id: 1, name: "name" });

const posts = ref([]);
const isLoading = ref(true);
const loadError = ref(false);
const selectedPost = ref(null);
const mode = ref(null);

const sidebarOpen = computed(() => mode.value !== null);

const fetchPosts = async () => {
  isLoading.value = true;
  loadError.value = false;

  try {
    posts.value = await getPosts();
  } catch (e) {
    loadError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPosts);

const openCreateForm = () => {
  selectedPost.value = null;
  mode.value = "create";
};

const openPost = (post) => {
  selectedPost.value = post;
  mode.value = "view";
};

const closeSidebar = () => {
  selectedPost.value = null;
  mode.value = null;
};

const handleCreatePost = async (data) => {
  const previousPosts = [...posts.value];

  try {
    const newPost = await createPost(data);

    posts.value.unshift(newPost);
    selectedPost.value = newPost;
    mode.value = "view";
  } catch (e) {
    posts.value = previousPosts;
    alert("Could not create post");
  }
};

const handleUpdatePost = async (data) => {
  const previousPosts = [...posts.value];
  const previousSelected = { ...selectedPost.value };

  try {
    const updated = await updatePost(selectedPost.value.id, data);

    const index = posts.value.findIndex((p) => p.id === updated.id);

    if (index !== -1) {
      posts.value[index] = updated;
    }

    selectedPost.value = updated;
    mode.value = "view";
  } catch (e) {
    posts.value = previousPosts;
    selectedPost.value = previousSelected;
    alert("Could not update post");
  }
};

const handleDeletePost = async () => {
  if (!confirm("Are you sure?")) return;

  const previousPosts = [...posts.value];
  const deletedId = selectedPost.value.id;

  posts.value = posts.value.filter((p) => p.id !== deletedId);

  try {
    await deletePost(deletedId);
    closeSidebar();
  } catch (e) {
    posts.value = previousPosts;
    alert("Could not delete post");
  }
};
</script>
