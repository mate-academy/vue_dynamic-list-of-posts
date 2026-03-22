<template>
  <!-- Garante que a página só renderize se houver um usuário -->
  <div v-if="user">
    <AppHeader :user="user" @logout="handleLogout" />

    <div class="tile is-ancestor">
      <PostsList
        :posts="posts"
        :loading="postsLoading"
        :error="postsError"
        :selectedPostId="selectedPost ? selectedPost.id : null"
        @select-post="handleSelectPost"
        @add-new-post="handleAddNewPost"
      />

      <Sidebar :isOpen="isSidebarOpen">
        <!-- O conteúdo da Sidebar só é renderizado quando ela está aberta -->
        <template v-if="isSidebarOpen">
          <PostForm
            v-if="showPostForm"
            :userId="user.id"
            @created="handlePostCreated"
            @cancel="closeSidebar"
          />

          <PostDetails
            v-else-if="selectedPost"
            :post="selectedPost"
            @post-deleted="handlePostDeleted"
            @post-updated="handlePostUpdated"
          />
        </template>
      </Sidebar>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue';
import PostsList from '../components/PostsList.vue';
import PostForm from '../components/PostForm.vue';
import PostDetails from '../components/PostDetails.vue';
import Sidebar from '../components/Sidebar.vue';
import { getUserPosts } from '../api/posts';
import { userStore, clearUser } from '../store/userStore';

export default {
  name: 'PostsView',
  components: { AppHeader, PostsList, PostForm, PostDetails, Sidebar },
  data() {
    return {
      posts: [], // Lista de posts do usuário
      postsLoading: false, // Estado de loading dos posts
      postsError: false, // Indicador de erro na busca
      selectedPost: null, // Post selecionado para exibição
      showPostForm: false, // Controla se mostra o form de criação
    };
  },
  computed: {
    user() {
      return userStore.user;
    },
    // A sidebar está aberta se um post estiver selecionado ou o form estiver ativo
    isSidebarOpen() {
      return this.selectedPost !== null || this.showPostForm;
    },
  },
  created() {
    // Redireciona para o login caso o usuário tente acessar sem estar com login feito
    if (!this.user) {
      this.$router.push('/');
      return;
    }

    this.loadPosts();
  },
  methods: {
    // Busca os posts do usuário atual
    async loadPosts() {
      this.postsLoading = true;
      this.postsError = false;

      try {
        this.posts = await getUserPosts(this.user.id);
      } catch (error) {
        this.postsError = true;
      } finally {
        this.postsLoading = false;
      }
    },

    // Seleciona um post para abrir na sidebar
    handleSelectPost(post) {
      this.showPostForm = false;
      this.selectedPost = post;
    },

    // Prepara para criar um novo post
    handleAddNewPost() {
      this.selectedPost = null;
      this.showPostForm = true;
    },

    // Adiciona o post criado à lista e o seleciona
    handlePostCreated(newPost) {
      this.posts.push(newPost);
      this.showPostForm = false;
      this.selectedPost = newPost;
    },

    // Remove o post deletado da lista local e fecha a sidebar
    handlePostDeleted(postId) {
      this.posts = this.posts.filter((p) => p.id !== postId);
      this.closeSidebar();
    },

    // Substitui o post atualizado na lista local
    handlePostUpdated(updatedPost) {
      const index = this.posts.findIndex((p) => p.id === updatedPost.id);

      if (index !== -1) {
        this.posts.splice(index, 1, updatedPost);
      }

      this.selectedPost = updatedPost;
    },

    closeSidebar() {
      this.selectedPost = null;
      this.showPostForm = false;
    },

    handleLogout() {
      clearUser();
      this.$router.push('/');
    },
  },
};
</script>
