<template>
  <div>
    <!-- AppHeader -->
    <AppHeader v-if="isLoggedIn" :user="currentUser" @logout="handleLogout" />

    <!-- UserLogin -->
    <UserLogin v-else @login="handleLogin" @register="handleRegister" />

    <!-- Main App View -->
    <main v-if="isLoggedIn" class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <!-- Posts List -->
          <div
            class="posts-list-container"
            :class="{ 'posts-list--shrunk': isSidebarOpen }"
          >
            <PostsList
              :posts="posts"
              :selectedPostId="selectedPost?.id"
              :loading="loadingPosts"
              @add-post="openSidebarForNewPost"
              @open-post="toggleSidebarForPost"
            />
          </div>

          <!-- Sidebar -->
          <Sidebar
            :isOpen="isSidebarOpen"
            :post="selectedPost"
            @close="closeSidebar"
            @create-post="addNewPost"
            @delete-post="deletePost"
            @update:post="updatePost"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import PostsList from './components/PostsList.vue';
import Sidebar from './components/SideBar.vue';
import AppHeader from './components/AppHeader.vue';
import UserLogin from './components/UserLogin.vue';

export default {
  components: {
    PostsList,
    Sidebar,
    AppHeader,
    UserLogin,
  },
  data() {
    return {
      isSidebarOpen: false,
      selectedPost: null,
      currentUser: null,
      isLoggedIn: false,
      posts: [],
      loadingPosts: false,
    };
  },
  methods: {
    openSidebarForNewPost() {
      this.selectedPost = null;
      this.isSidebarOpen = true;
    },
    toggleSidebarForPost(postId) {
      if (this.selectedPost?.id === postId) {
        this.closeSidebar();
      } else {
        this.selectedPost = this.posts.find(post => post.id === postId);
        this.isSidebarOpen = true;
      }
    },
    closeSidebar() {
      this.isSidebarOpen = false;
      this.selectedPost = null;
    },
    addNewPost(newPost) {
      const newId = this.posts.length > 0 ? Math.max(...this.posts.map(post => post.id)) + 1 : 1;
      this.posts.push({ id: newId, ...newPost });
      this.closeSidebar();
    },
    deletePost(postId) {
      this.posts = this.posts.filter(post => post.id !== postId);
      this.closeSidebar();
    },
    updatePost(updatedPost) {
      const postIndex = this.posts.findIndex(post => post.id === updatedPost.id);
      if (postIndex !== -1) {
        this.posts.splice(postIndex, 1, updatedPost);
      }
      this.selectedPost = updatedPost;
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.currentUser = null;
      console.log('User logged out');
    },
    handleLogin(email) {
      const user = JSON.parse(localStorage.getItem(email));
      if (user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        console.log('User logged in:', user);
      } else {
        console.error('User not found. Please register.');
      }
      this.loadingPosts = true;
      setTimeout(() => {
        this.loadingPosts = false;
      }, 1500);
    },
    handleRegister(user) {
      localStorage.setItem(user.email, JSON.stringify(user));
      this.currentUser = user;
      this.isLoggedIn = true;
      console.log('User registered and logged in:', user);
    },
  },
};
</script>

<style scoped>
.posts-list-container {
  flex-grow: 1;
  flex-shrink: 1;
  transition: flex-basis 0.5s ease-in-out, max-width 0.5s ease-in-out;
  max-width: 100%;
}

.posts-list--shrunk {
  max-width: 50%;
}

.tile.is-ancestor {
  display: flex;
  align-items: stretch;
}

.Sidebar {
  flex-shrink: 0;
  transition: max-width 0.5s ease-in-out, opacity 0.5s ease-in-out;
  max-width: 0;
  opacity: 0;
}

.Sidebar--open {
  max-width: 50%;
  opacity: 1;
}
</style>