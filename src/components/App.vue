<template>
  <section class="section">
    <div class="container">
      <Header :user="user" @logout="logout" />

      <button class="button is-primary mb-4" @click="openNewPostForm">
        Create new post
      </button>

      <Loader v-if="isLoading" />
      <Notification v-if="error" :message="error" type="is-danger" />
      <Notification v-if="!posts.length && !isLoading" message="No posts yet" type="is-info" />

      <PostsTable v-if="posts.length" :posts="posts" @select="selectPost" />

      <Sidebar
        :selectedPost="selectedPost"
        :isCreating="isCreating"
        :currentUserId="user.id" 
        @close="closeSidebar"
        @cancel="closeSidebar"
        @created="addPost"
        @updated="updatePost"
        @deleted="deletePost"
      />
    </div>
  </section>
</template>

<script>
import Header from './Header.vue';
import PostsTable from './PostsTable.vue';
import Sidebar from './Sidebar.vue';
import Loader from './Loader.vue';
import Notification from './Notification.vue';

export default {
  components: { Header, PostsTable, Sidebar, Loader, Notification },
  data() {
    return {
      posts: [],
      selectedPost: null,
      isCreating: false,
      isLoading: false,
      error: null,
      user: { id: 1, name: 'John Doe' },
    };
  },
  methods: {
    async fetchPosts() {
      this.error = null; // Limpa erro anterior
      this.isLoading = true;
      
      try {
        const res = await fetch(`https://mate-academy.github.io/fe-students-api/posts?userId=${this.user.id}`);
        
        // Verifica se a resposta é OK
        if (!res.ok) {
          throw new Error(`Failed to load posts: ${res.status} ${res.statusText}`);
        }
        
        this.posts = await res.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    openNewPostForm() {
      this.selectedPost = null;
      this.isCreating = true;
    },
    selectPost(post) {
      this.selectedPost = post;
      this.isCreating = false;
    },
    closeSidebar() {
      this.selectedPost = null;
      this.isCreating = false;
    },
    addPost(newPost) {
      this.posts.push(newPost);
      this.selectedPost = newPost;
      this.isCreating = false;
    },
    updatePost(updatedPost) {
      const index = this.posts.findIndex(p => p.id === updatedPost.id);
      if (index !== -1) this.posts.splice(index, 1, updatedPost);
      this.selectedPost = updatedPost;
    },
    deletePost(postId) {
      this.posts = this.posts.filter(p => p.id !== postId);
      this.closeSidebar();
    },
    logout() {
      console.log('Logout clicked');
    }
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>