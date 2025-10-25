<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { PostsAPI } from "../api/client";
import type { Post } from "../types/Post";
import PostLoader from "./PostLoader.vue";
import Sidebar from "./Sidebar.vue";
import AddPost from "./AddPost.vue";
import PostPreview from "./PostPreview.vue";

const userId = inject<number>("userId", 3264);
const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const addPostOpen = ref(false);
const selectedPost = ref<Post | null>(null);
const editingPost = ref<Post | null>(null);
const deleting = ref<number | null>(null);

onMounted(async () => {
  try {
    loading.value = true;

    const userPosts = await PostsAPI.getPostsByUserId(userId);

    posts.value = userPosts;
  } catch (err) {
    error.value = "Failed to load data";
  } finally {
    loading.value = false;
  }
});

const handlePostAdded = (newPost: Post) => {
  posts.value.push(newPost);
  addPostOpen.value = false;
  editingPost.value = null;
  selectedPost.value = newPost;
};

const togglePost = (post: Post) => {
  // If clicking the same post, close it
  if (selectedPost.value?.id === post.id) {
    selectedPost.value = null;
  } else {
    // Otherwise, open the new post
    addPostOpen.value = false; // Close add post sidebar
    selectedPost.value = post;
  }
};

const openAddPost = () => {
  selectedPost.value = null;
  editingPost.value = null;
  addPostOpen.value = true;
};

const openEditPost = (post: Post) => {
  selectedPost.value = null;
  editingPost.value = post;
  addPostOpen.value = true;
}

const closeSidebar = () => {
  addPostOpen.value = false;
  editingPost.value = null;
  selectedPost.value = null;
};

const handlePostUpdated = (updatedPost: Post) => {
  const index = posts.value.findIndex((p) => p.id === updatedPost.id);
  if (index !== -1) {
    posts.value[index] = updatedPost;
  }
  addPostOpen.value = false;
  editingPost.value = null;
  selectedPost.value = updatedPost;
};

const handleDelete = async (post: Post) => {
  deleting.value = post.id;
  try {
    await PostsAPI.deletePost(post.id);
    posts.value = posts.value.filter((p) => p.id !== post.id);
    if (selectedPost.value?.id === post.id) {
      selectedPost.value = null;
    }
  } catch {
    error.value = "Failed to delete post";
  } finally {
    deleting.value = null;
  }
};
</script>

<template>
  <div class="posts-container">
    <div
      class="posts-section"
      :class="{ 'posts-section--with-sidebar': addPostOpen || selectedPost }"
    >
      <div class="box is-success">
        <div class="block">
          <div class="block is-flex is-justify-content-space-between">
            <h2 class="title m-0">Posts</h2>
            <button
              type="button"
              class="button is-primary"
              :class="{ 'is-light': addPostOpen }"
              @click="openAddPost"
            >
              Add New Post
            </button>
          </div>
          <PostLoader v-if="loading"></PostLoader>

          <div v-else-if="error" class="notification is-danger">
            {{ error }}
          </div>

          <table
            v-else-if="posts.length > 0"
            class="table is-fullwidth is-striped is-hoverable is-narrow"
          >
            <thead>
              <tr class="has-background-primary">
                <th>ID</th>
                <th>Title</th>
                <th class="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in posts" class="my-2">
                <td class="is-vcentered">{{ post.id }}</td>
                <td class="is-vcentered">{{ post.title }}</td>
                <td class="has-text-right is-vcentered">
                  <button
                    type="button"
                    class="button is-primary"
                    :class="{ 'is-light': selectedPost?.id === post.id }"
                    @click="togglePost(post)"
                  >
                    {{ selectedPost?.id === post.id ? "Close" : "Open" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="notification is-warning">
            No posts found for this user.
          </div>
        </div>
      </div>
    </div>
    <Sidebar :is-open="addPostOpen || !!selectedPost">
      <AddPost
        v-if="addPostOpen"
        :post="editingPost"
        @close="closeSidebar"
        @postAdded="handlePostAdded"
        @postUpdated="handlePostUpdated"
      ></AddPost>
      <PostPreview
        v-if="selectedPost"
        :post="selectedPost"
        :deleting="deleting"
        @edit="openEditPost"
        @delete="handleDelete"
      ></PostPreview>
    </Sidebar>
  </div>
</template>

<style scoped lang="scss">
.posts {
  &-container {
    display: flex;
    gap: 1rem;
    align-items: flex-start;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &-section {
    flex: 1;
    transition: flex 0.5s ease-in-out;

    &--with-sidebar {
      flex: 0 0 50%;

      @media (max-width: 768px) {
        flex: 1;
      }
    }
  }
}
</style>
