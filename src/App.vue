<template>
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <Loader v-if="isLoading" />

        <div
          v-else-if="error"
          class="notification is-danger"
        >
          Failed to load posts
        </div>

        <div
          v-else
          class="tile is-parent"
        >
          <div class="tile is-child">
            <div
              v-if="actionError"
              class="notification is-danger"
            >
              {{ actionError }}
            </div>

            <PostsList
              :posts="posts"
              @add="openCreatePost"
              @open="openPost"
            />
          </div>
        </div>

        <Sidebar
          :is-open="isSidebarOpen"
          :is-creating="isCreating"
          :is-editing="isEditing"
          :is-submitting="isCreatingPost"
          :is-updating-post="isUpdatingPost"
          :post="selectedPost"
          @close="closeSidebar"
          @create="handleCreatePost"
          @edit="handleEditPost"
          @delete="handleDeletePost"
          @save="handleUpdatePost"
          @cancel-edit="cancelEdit"
        />
      </div>
    </div>
  </main>
</template>

<script>
import Loader from './components/Loader.vue';
import PostsList from './components/PostsList.vue';
import Sidebar from './components/Sidebar.vue';

import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
} from './services/api';

export default {
  name: 'App',

  components: {
    Loader,
    PostsList,
    Sidebar,
  },

  data() {
    return {
      user: {
        id: 1,
        name: 'User',
      },

      posts: [],

      isLoading: true,
      error: false,

      isSidebarOpen: false,

      isCreating: false,
      isEditing: false,

      isCreatingPost: false,
      isUpdatingPost: false,

      selectedPost: null,

      actionError: '',
    };
  },

  async mounted() {
    try {
      this.posts = await getPosts(this.user.id);
    } catch (error) {
      this.error = true;
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    openCreatePost() {
      this.actionError = '';

      this.selectedPost = null;
      this.isCreating = true;
      this.isEditing = false;
      this.isSidebarOpen = true;
    },

    openPost(post) {
      this.actionError = '';

      this.selectedPost = post;
      this.isCreating = false;
      this.isEditing = false;
      this.isSidebarOpen = true;
    },

    closeSidebar() {
      this.isSidebarOpen = false;
      this.isCreating = false;
      this.isEditing = false;
      this.selectedPost = null;
      this.actionError = '';
    },

    async handleCreatePost(post) {
      this.actionError = '';
      this.isCreatingPost = true;

      try {
        const newPost = await createPost({
          ...post,
          userId: this.user.id,
        });

        this.posts.push(newPost);

        this.selectedPost = newPost;
        this.isCreating = false;
        this.isEditing = false;
        this.isSidebarOpen = true;
      } catch (error) {
        this.actionError = 'Failed to create post';
      } finally {
        this.isCreatingPost = false;
      }
    },

    async handleDeletePost(post) {
      this.actionError = '';

      try {
        await deletePost(post.id);

        this.posts = this.posts.filter(
          currentPost => currentPost.id !== post.id,
        );

        this.closeSidebar();
      } catch (error) {
        this.actionError = 'Failed to delete post';
      }
    },

    handleEditPost(post) {
      this.actionError = '';

      this.selectedPost = post;
      this.isCreating = false;
      this.isEditing = true;
      this.isSidebarOpen = true;
    },

    cancelEdit() {
      this.isEditing = false;
    },

    async handleUpdatePost(post) {
      this.actionError = '';
      this.isUpdatingPost = true;

      try {
        const updatedPost = await updatePost(post);

        const index = this.posts.findIndex(
          currentPost => currentPost.id === updatedPost.id,
        );

        if (index !== -1) {
          this.posts[index] = updatedPost;
        }

        this.selectedPost = updatedPost;
        this.isEditing = false;
      } catch (error) {
        this.actionError = 'Failed to update post';
      } finally {
        this.isUpdatingPost = false;
      }
    },
  },
};
</script>
