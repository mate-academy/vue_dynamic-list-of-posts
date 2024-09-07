<script>
import PostList from './components/PostList.vue';
import Loader from './components/Loader.vue';
import Sidebar from './components/Sidebar.vue';
import PostForm from './components/PostForm.vue';
import PostDetail from './components/PostDetail.vue';
import PostEditing from './components/PostEditing.vue';
import { createPost, deletePost, getPosts, patchPost } from './api/posts';
import { createComment, deleteComment, getComments } from './api/comments';

export default {
  data() {
    return {
      posts: [],
      errorMessages: '',
      loader: true,
      sidebar: false,
      selectedPost: null,
      editingPost: null,
      comments: [],
      addCommentMenu: false,
    }
  },
  components: {
    PostList,
    Loader,
    Sidebar,
    PostForm,
    PostDetail,
    PostEditing,
  },
  mounted() {
    getPosts().then(({ data }) => {
      this.errorMessages = '';
      this.posts = data;
    })
      .catch(() => {
        this.errorMessages = 'Unable to load todos';
      })
      .finally(() => {
        this.loader = false;
      })
  },
  methods: {
    addPost({ userId, title, body }) {
      createPost({ userId, title, body }).then(({ data }) => {
        this.errorMessages = '';
        this.posts.push(data);
        this.openPost(data);
      })
        .catch(() => {
          this.errorMessages = 'Unable to add todo';
        });
    },
    openPost(post) {
      this.editingPost = null
      this.selectedPost = post;
      this.sidebar = true;
      this.getComment(post.id);
      this.addCommentMenu = false;
    },
    removePost() {
      this.sidebar = false;
      deletePost(this.selectedPost.id)
        .then(() => {
          this.errorMessages = '';
          this.posts = this.posts.filter(post => post.id !== this.selectedPost.id);
          this.selectedPost = null;
        })
        .catch(() => {
          this.errorMessages = 'Unable to delete todo';
        })
    },
    editPost(event) {
      console.log(event);
      patchPost(event).then(({ data }) => {
        this.errorMessages = '';
        this.posts = this.posts.map(post =>
          post.id === event.id ? data : post
        );
        this.selectedPost = event;
        this.editingPost = null;
      })
        .catch(() => {
          this.errorMessages = 'Unable to update post';
        });
    },
    getComment(postId) {
      this.loader = true;
      getComments(postId).then(({ data }) => {
        this.errorMessages = '';
        this.comments = Array.isArray(data) ? data : [data];
      })
        .catch(() => {
          this.errorMessages = 'Unable to load comments';
        })
        .finally(() => {
          this.loader = false;
        })
    },
    openMenu() {
      this.addCommentMenu = true;
    },
    closeMenu() {
      this.addCommentMenu = false;
    },
    createComment(event) {
      createComment(event).then(({ data }) => {
        this.errorMessages = '';
        this.addCommentMenu = false;
        this.comments.push(data);
      })
      .catch(() => {
        this.errorMessages = 'Unable to create comment';
      })
    },
    deleteComment(event) {
      deleteComment(event.id).then(() => {
        this.comments = this.comments.filter(comment => comment.id !== event.id);
      })
      .catch(() => {
        this.errorMessages = 'Unable to delete comment';
      });
    },
    changeSidebar(event) {
      this.sidebar = event; 
      this.selectedPost = null; 
      this.editingPost = null;
    },
    closePost() {
      this.selectedPost = null; 
      this.sidebar = false
    },
    openEditPost(event) {
      this.editingPost = event; 
      this.selectedPost = null
    },
    closeEditPost() {
      this.selectedPost = this.editingPost; 
      this.editingPost = null
    }
  }
}
</script>

<template>
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor is-flex is-justify-content-center">
        <PostList
          class="is-flex-grow-1" 
          :posts="posts" 
          :loader="loader" 
          :errorMessages="errorMessages"
          :selectedPost="selectedPost"
          @sidebar:change="changeSidebar" 
          @openPost="openPost"
          @closePost="closePost" 
        />
        <Sidebar :sidebar="sidebar">
          <PostForm
            v-if="!selectedPost && sidebar && !editingPost"
            @cancel="sidebar = false" 
            @sumbit="addPost"
          />
          <PostDetail 
            v-if="selectedPost && !editingPost" 
            :post="selectedPost"
            :comments="comments"
            :loader="loader"
            :addCommentMenu="addCommentMenu"
            @remove="removePost"
            @edit="openEditPost" 
            @open-menu="openMenu" 
            @close-menu="closeMenu" 
            @write:comment="createComment" 
            @delete-comment="deleteComment"
          />
          <PostEditing 
            v-if="editingPost" 
            :editingPost="editingPost" 
            @cancel="closeEditPost" 
            @submit="editPost" 
          />
        </Sidebar>
      </div>
    </div>
  </main>
</template>

<style></style>
