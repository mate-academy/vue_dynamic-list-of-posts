<script setup>
import { ref, watch } from "vue";
import Header from "./components/Header.vue";
import PostsList from "./components/PostsList.vue";
import Sidebar from "./components/Sidebar.vue";
import Login from "./components/Login.vue";
import * as postApi from "./api/posts";

const user = ref(null);

const sidebarOpen = ref(false);
const newPost = ref(false);
const selectedPost = ref({ id: -1 });
const posts = ref([]);
const postsError = ref("");
const isLoadingPost = ref(false);
const errorMessage = ref("");

const loadPosts = async () => {
  if (!user.value) {
    posts.value = [];
    return;
  }

  try {
    isLoadingPost.value = true;
    postsError.value = "";

    const res = await postApi.getPosts(user.value.id);

    posts.value = res;
  } catch (error) {
    console.log("Failed to load posts", error);
    postsError.value = "Failed to load posts";
  } finally {
    isLoadingPost.value = false;
  }
};

const handlePostAdded = (addedPost) => {
  posts.value.push(addedPost);
  selectedPost.value = addedPost;
  newPost.value = false;
};

const handlePostUpdated = (updatedPost) => {
  const index = posts.value.findIndex((p) => p.id === updatedPost.id);

  if (index !== -1) {
    posts.value[index] = updatedPost;
  }

  selectedPost.value = updatedPost;
};

watch(
  user,
  () => {
    loadPosts();
  },
  { immediate: true },
);

const handlePostDelete = async (postToDelete) => {
  const previousPosts = [...posts.value];
  const previousSelectedPost = selectedPost.value;
  const previousSidebarOpen = sidebarOpen.value;

  errorMessage.value = "";

  posts.value = posts.value.filter((post) => post.id !== postToDelete.id);
  
  if (selectedPost.value?.id === postToDelete.id) {
    selectedPost.value = { id: -1 };
    sidebarOpen.value = false;
  }

  try {
    await postApi.deletePost(postToDelete.id);
  } catch (error) {
    console.error("Unable to delete a todo");
    posts.value = previousPosts;
    selectedPost.value = previousSelectedPost;
    sidebarOpen.value = previousSidebarOpen;
    errorMessage.value = "Unable to delete post. Please try again.";
  }
};

const handleLogout = () => {
  user.value = null;
  posts.value = [];
  selectedPost.value = { id: -1 };
  newPost.value = false;
  sidebarOpen.value = false;
};
</script>

<template>
  <template v-if="user">
    <Header :user="user" @logout="handleLogout" />

    <main class="section">
      <div class="container">
        <div v-if="errorMessage" class="notification is-danger is-light mb-4">
          <button class="delete" @click="errorMessage = ''"></button>
          {{ errorMessage }}
        </div>

        <div class="tile is-ancestor">
          <PostsList
            :posts="posts"
            :postsError="postsError"
            :sidebarOpen="sidebarOpen"
            :isLoadingPost="isLoadingPost"
            @setSidebar="sidebarOpen = $event"
            :selectedPost="selectedPost"
            @setselectedPost="selectedPost = $event"
            @setNewPost="newPost = $event"
          />
          <Sidebar
            :user="user"
            :class="{ 'Sidebar--open': sidebarOpen }"
            :sidebarOpen="sidebarOpen"
            :newPost="newPost"
            :selectedPost="selectedPost"
            @closeSidebar="sidebarOpen = false"
            @postAdded="handlePostAdded"
            @postUpdated="handlePostUpdated"
            @postDelete="handlePostDelete"
          />
        </div>
      </div>
    </main>
  </template>

  <Login v-else @setUser="user = $event" />
</template>

<style scoped>
.tile {
  align-items: stretch;
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: -webkit-min-content;
  min-height: -moz-min-content;
  min-height: min-content;
}
</style>
