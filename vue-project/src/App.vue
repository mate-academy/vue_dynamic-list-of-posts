<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="is-size-4">Vue List Of Posts</h2>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ user?.name || "Guest" }}</p>
          </div>
          <a class="button is-light" @click="logout">Logout</a>
        </div>
      </div>
    </div>
  </nav>

  <section class="container">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <PostsTable
            :posts="posts"
            :loading="loadingPosts"
            :error="postsError"
            @open-post="openPost"
            @create-post="openCreateForm"
          />
        </div>
      </div>
      <div
        class="tile is-parent is-8-desktop Sidebar"
        :class="{ 'Sidebar--open': isSidebarOpen }"
      >
        <Sidebar
          v-if="isSidebarOpen"
          :post="selectedPost"
          :is-editing="isEditing"
          :is-creating="isCreating"
          @close="closeSidebar"
          @save-post="savePost"
          @delete-post="handleDeletePost"
          @edit-post="startEditing"
          @add-comment="addComment"
          @delete-comment="handleDeleteComment"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import PostsTable from './components/PostsTable.vue';
import Sidebar from './components/Sidebar.vue';
import { usePosts } from './composables/usePosts';
import { useAuth } from './composables/useAuth';

const { posts, loadingPosts, postsError, fetchPosts, createPost, updatePost, deletePost } = usePosts();
const { user, logout } = useAuth();

const isSidebarOpen = ref(false);
const selectedPost = ref(null);
const isEditing = ref(false);
const isCreating = ref(false);

fetchPosts();

const openPost = (post) => {
  selectedPost.value = post;
  isSidebarOpen.value = true;
  isEditing.value = false;
  isCreating.value = false;
};

const openCreateForm = () => {
  selectedPost.value = null;
  isSidebarOpen.value = true;
  isCreating.value = true;
  isEditing.value = false;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  selectedPost.value = null;
  isEditing.value = false;
  isCreating.value = false;
};

const savePost = async (postData) => {
  try {
    if (isCreating.value) {
      const newPost = await createPost({ ...postData, userId: user.value.id });
      posts.value.push(newPost);
      selectedPost.value = newPost;
      isCreating.value = false;
    } else if (isEditing.value) {
      const updatedPost = await updatePost(selectedPost.value.id, postData);
      selectedPost.value = updatedPost;
      const index = posts.value.findIndex((p) => p.id === updatedPost.id);
      posts.value[index] = updatedPost;
      isEditing.value = false;
    }
  } catch (error) {
    alert('Failed to save post. Please try again.');
  }
};

const handleDeletePost = async (postId) => {
  try {
    await deletePost(postId);
    posts.value = posts.value.filter((p) => p.id !== postId);
    closeSidebar();
  } catch (error) {
    alert('Failed to delete post. Please try again.');
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const addComment = async (commentData) => {
  // Handled in Sidebar.vue
};

const handleDeleteComment = async (commentId) => {
  // Handled in Sidebar.vue
};
</script>
