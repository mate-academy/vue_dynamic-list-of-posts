// Main App Component
const { createApp } = Vue;

const App = {
  name: 'App',
  components: {
    PostsList,
    Sidebar,
  },
  data() {
    return {
      posts: [],
      isLoadingPosts: false,
      loadPostsError: '',
      
      // Sidebar state
      sidebarMode: 'closed', // 'closed', 'create', 'view', 'edit'
      currentPost: null,
    };
  },
  computed: {
    isSidebarOpen() {
      return this.sidebarMode !== 'closed';
    },
  },
  mounted() {
    this.loadPosts();
  },
  methods: {
    async loadPosts() {
      this.isLoadingPosts = true;
      this.loadPostsError = '';

      try {
        this.posts = await api.getPosts();
      } catch (error) {
        this.loadPostsError = 'Failed to load posts';
      } finally {
        this.isLoadingPosts = false;
      }
    },

    // Sidebar actions
    handleAddNew() {
      this.sidebarMode = 'create';
      this.currentPost = null;
    },

    handleOpenPost(post) {
      this.currentPost = post;
      this.sidebarMode = 'view';
    },

    handleEditPost() {
      this.sidebarMode = 'edit';
    },

    async handleDeletePost() {
      if (!this.currentPost) return;

      const confirmDelete = confirm(
        `Are you sure you want to delete the post "${this.currentPost.title}"?`
      );
      
      if (!confirmDelete) return;

      try {
        await api.deletePost(this.currentPost.id);
        
        // Eliminar de la lista
        this.posts = this.posts.filter(p => p.id !== this.currentPost.id);
        
        // Cerrar sidebar
        this.closeSidebar();
      } catch (error) {
        alert('Failed to delete post. Please try again.');
      }
    },

    async handleSavePost(postData) {
      try {
        if (this.sidebarMode === 'create') {
          // Crear nueva publicación
          const newPost = await api.createPost(postData);
          
          // Agregar a la lista
          this.posts.push(newPost);
          
          // Mostrar el post recién creado
          this.currentPost = newPost;
          this.sidebarMode = 'view';
        } else if (this.sidebarMode === 'edit' && this.currentPost) {
          // Actualizar publicación existente
          const updatedPost = await api.updatePost(this.currentPost.id, postData);
          
          // Actualizar en la lista
          const index = this.posts.findIndex(p => p.id === this.currentPost.id);
          if (index !== -1) {
            this.posts[index] = { ...this.posts[index], ...updatedPost };
          }
          
          // Actualizar currentPost y cambiar a vista
          this.currentPost = { ...this.currentPost, ...updatedPost };
          this.sidebarMode = 'view';
        }
      } catch (error) {
        alert('Failed to save post. Please try again.');
      }
    },

    handleCancel() {
      if (this.sidebarMode === 'create') {
        this.closeSidebar();
      } else if (this.sidebarMode === 'edit') {
        this.sidebarMode = 'view';
      }
    },

    closeSidebar() {
      this.sidebarMode = 'closed';
      this.currentPost = null;
    },
  },
  template: `
    <div class="container">
      <section class="section">
        <h1 class="title">Dynamic List of Posts</h1>
        
        <div class="tile is-ancestor">
          <PostsList
            :posts="posts"
            :isLoading="isLoadingPosts"
            :error="loadPostsError"
            @addNew="handleAddNew"
            @openPost="handleOpenPost"
          />

          <Sidebar
            :isOpen="isSidebarOpen"
            :mode="sidebarMode"
            :currentPost="currentPost"
            @save="handleSavePost"
            @edit="handleEditPost"
            @delete="handleDeletePost"
            @cancel="handleCancel"
          />
        </div>
      </section>
    </div>
  `
};

// Create and mount the Vue app
createApp(App).mount('#app');
