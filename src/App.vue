<template>
  <div>
    <main class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <div
            v-if="isLoading"
            class="tile is-parent"
          >
            <div class="tile is-child box">
              Loading...
            </div>
          </div>

          <div
            v-else-if="error"
            class="notification is-danger"
          >
            Failed to load posts
          </div>

         <PostsList
           v-else
           :posts="posts"
           @add="openCreatePost"
           @open="openPost"
          />
   
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
  </div>
</template>

<script>
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
      this.selectedPost = null;
      this.isCreating = true;
      this.isEditing = false;
      this.isSidebarOpen = true;
    },

    openPost(post) {
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
    },

    async handleCreatePost(post) {
      this.isCreatingPost = true;

      try {
        const newPost = await createPost({
          ...post,
          userId: this.user.id,
        });

        this.posts.push(newPost);

        this.closeSidebar();
      } catch (error) {
        console.error(error);
      } finally {
        this.isCreatingPost = false;
      }
    },

    async handleDeletePost(post) {
      try {
        await deletePost(post.id);

        this.posts = this.posts.filter(
          currentPost => currentPost.id !== post.id,
        );

        this.closeSidebar();
      } catch (error) {
        console.error(error);
      }
    },

    handleEditPost(post) {
      this.selectedPost = post;
      this.isCreating = false;
      this.isEditing = true;
      this.isSidebarOpen = true;
    },

    cancelEdit() {
      this.isEditing = false;
    },

    async handleUpdatePost(post) {
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
        console.error(error);
      } finally {
        this.isUpdatingPost = false;
      }
    },
  },
};
</script>
