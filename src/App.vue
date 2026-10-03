<script>
import { deletePost, getPosts } from './api/posts.js';
import AddPost from './components/AddPost.vue';
import EditPost from './components/EditPost.vue';
import Header from './components/Header.vue';
import Loader from './components/Loader.vue';
import Login from './components/Login.vue';
import Notification from './components/Notification.vue';
import PostList from './components/PostsList.vue';
import PostPreview from './components/PostPreview.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    AddPost,
    EditPost,
    Header,
    Loader,
    Login,
    Notification,
    PostList,
    PostPreview,
    Sidebar,
  },
  data() {
    return {
      user: null,
      posts: [],
      isLoadingPosts: false,
      postsError: '',
      sidebarMode: null,
      selectedPostId: null,
      isDeletingPost: false,
    };
  },
  computed: {
    selectedPost() {
      return this.posts.find((post) => post.id === this.selectedPostId) ?? null;
    },
    isSidebarOpen() {
      return this.sidebarMode !== null;
    },
  },
  methods: {
    onLogin(user) {
      this.user = user;
      this.selectedPostId = null;
      this.sidebarMode = null;
      this.loadPosts();
    },
    logOut() {
      this.user = null;
      this.posts = [];
      this.selectedPostId = null;
      this.sidebarMode = null;
      this.postsError = '';
      this.isDeletingPost = false;
    },
    async loadPosts() {
      if (!this.user) {
        return;
      }

      const userId = this.user.id;
      this.isLoadingPosts = true;
      this.postsError = '';

      try {
        const data = await getPosts(userId);

        if (this.user?.id === userId) {
          this.posts = data;
        }
      } catch {
        if (this.user?.id === userId) {
          this.postsError = 'Unable to load posts';
          this.posts = [];
        }
      } finally {
        if (this.user?.id === userId) {
          this.isLoadingPosts = false;
        }
      }
    },
    addPost() {
      this.selectedPostId = null;
      this.sidebarMode = 'add';
    },
    openPost(postId) {
      this.selectedPostId = postId;
      this.sidebarMode = 'preview';
    },
    closePost() {
      this.selectedPostId = null;
      this.sidebarMode = null;
    },
    startEdit() {
      this.sidebarMode = 'edit';
    },
    cancelEdit() {
      this.sidebarMode = this.selectedPost ? 'preview' : null;
    },
    handlePostCreated(newPost) {
      this.posts = [newPost, ...this.posts];
      this.openPost(newPost.id);
    },
    handlePostUpdated(updatedPost) {
      this.posts = this.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post,
      );
      this.selectedPostId = updatedPost.id;
      this.sidebarMode = 'preview';
    },
    async handlePostDeleted(postId) {
      if (this.isDeletingPost) {
        return;
      }

      this.postsError = '';
      this.isDeletingPost = true;

      try {
        await deletePost(postId);
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.closePost();
      } catch {
        this.postsError = 'Unable to delete post';
      } finally {
        this.isDeletingPost = false;
      }
    },
    clearPostsError() {
      this.postsError = '';
    },
  },
};
</script>

<template>
  <div class="ghost-wrapper">
    <template v-if="user">
      <Header :name="user.name" @logout="logOut" />

      <main class="section">
        <div class="container is-fluid">
          <Loader v-if="isLoadingPosts" />

          <Notification
            v-if="postsError"
            :message="postsError"
            @close="clearPostsError"
          />

          <div v-if="!isLoadingPosts && !postsError" class="columns">
            <PostList
              :posts="posts"
              :selected-post-id="selectedPostId"
              @select="openPost"
              @close="closePost"
              @add="addPost"
            />

            <Sidebar :is-open="isSidebarOpen">
              <AddPost
                v-if="sidebarMode === 'add'"
                :user-id="user.id"
                @cancel="closePost"
                @success="handlePostCreated"
              />
              <EditPost
                v-else-if="sidebarMode === 'edit' && selectedPost"
                :post="selectedPost"
                @cancel="cancelEdit"
                @success="handlePostUpdated"
              />
              <PostPreview
                v-else-if="sidebarMode === 'preview' && selectedPost"
                :post="selectedPost"
                :is-deleting="isDeletingPost"
                @delete="handlePostDeleted"
                @edit="startEdit"
              />
            </Sidebar>
          </div>
        </div>
      </main>
    </template>

    <Login v-else @login="onLogin" />
  </div>
</template>
