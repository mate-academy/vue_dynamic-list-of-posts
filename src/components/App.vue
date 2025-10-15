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
      user: null, // ✅ MUDAR DE HARD-CODED PARA NULL
    };
  },
  methods: {
    async fetchUser() {
      try {
        const res = await fetch('https://mate-academy.github.io/fe-students-api/users.json');
        if (!res.ok) throw new Error('Failed to load user');
        const users = await res.json();
        this.user = users[0]; // ✅ USAR PRIMEIRO USUÁRIO DA API
      } catch (error) {
        console.error('Failed to load user:', error);
        // Fallback para desenvolvimento
        this.user = { id: 1, name: 'Fallback User' };
      }
    },
    async fetchPosts() {
      if (!this.user) return; // ✅ ESPERAR USUÁRIO CARREGAR
      
      this.error = null;
      this.isLoading = true;
      
      try {
        const res = await fetch(`https://mate-academy.github.io/fe-students-api/posts?userId=${this.user.id}`);
        
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
    // ... outros métodos permanecem iguais ...
  },
  async mounted() {
    await this.fetchUser(); // ✅ CARREGAR USUÁRIO PRIMEIRO
    this.fetchPosts();
  },
};
</script>