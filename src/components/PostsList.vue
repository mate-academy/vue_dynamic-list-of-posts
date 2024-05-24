<template>
  <div class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <div class="block is-flex is-justify-content-space-between">
                <p class="title">Posts</p>
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': showNewPostForm }"
                  @click="handleShowNewPostForm"
                >
                  Add New Post
                </button>
              </div>
              <NoPostsYet v-if="!posts.length && !isLoading" />
              <PostLoader v-if="isLoading" />
              <table
                class="table is-fullwidth is-striped is-hoverable is-narrow"
                v-if="posts.length"
              >
                <thead>
                  <tr class="has-background-link-light">
                    <th>ID</th>
                    <th>Title</th>
                    <th class="has-text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in posts" :key="post.id">
                    <td>{{ post.id }}</td>
                    <td>{{ post.title }}</td>
                    <td class="has-text-right is-vcentered">
                      <button
                        type="button"
                        class="button is-link"
                        :class="{ 'is-light': openedPost !== post }"
                        @click="togglePostPreview(post)"
                      >
                        {{ openedPost === post ? 'Close' : 'Open' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
                <p class="help is-danger" v-if="errorMessage">{{ errorMessage }}</p>
              </table>
            </div>
          </div>
        </div>
        <AppSidebar
          :showNewPostForm="showNewPostForm"
          :showPostPreview="showPostPreview"
          :showAddCommentForm="showAddCommentForm"
          :userId="user.id"
          :openedPost="openedPost"
          :isEditing="isEditing"
          @close-new-post-form="handleCloseNewPostForm"
          @close-edit-form="handleCloseEditForm"
          @post-added="addPost"
          @post-deleted="deletePost"
          @post-edited="editPost"
          @post-edit="handleEditPost"
          @show-add-comment-form="handleShowAddCommentForm"
          @close-add-comment-form="handleCloseAddCommentForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getPosts } from '@/api/posts';
import NoPostsYet from './NoPostsYet.vue';
import AppSidebar from './sidebar/AppSidebar.vue';
import PostLoader from './PostLoader.vue';

export default {
  name: 'PostList',
  components: { NoPostsYet, AppSidebar, PostLoader },
  props: {
    user: Object
  },
  data() {
    return {
      posts: [],
      errorMessage: '',
      isLoading: false,
      showNewPostForm: false,
      showPostPreview: false,
      showAddCommentForm: false,
      openedPost: {},
      isEditing: false
    };
  },
  mounted() {
    this.loadPosts();
  },
  methods: {
    loadPosts() {
      this.showNewPostForm = false;
      this.showPostPreview = false;
      this.isLoading = true;

      getPosts(this.user.id)
        .then(({ data }) => {
          this.posts = data;
        })
        .catch(() => {
          this.isLoading = false;
          this.errorMessages = 'Unable to load posts';
        })
        .finally(() => (this.isLoading = false));
    },
    handleShowNewPostForm() {
      this.showNewPostForm = true;
      this.showPostPreview = false;
      this.showAddCommentForm = false;
      this.isEditing = false;
      this.openedPost = {};
    },
    handleCloseNewPostForm() {
      this.showNewPostForm = false;
    },
    handleShowAddCommentForm() {
      this.showAddCommentForm = true;
    },
    handleCloseAddCommentForm() {
      this.showAddCommentForm = false;
    },
    handleEditPost(post) {
      this.openedPost = post;
      this.isEditing = true;
      this.showAddCommentForm = false;
    },
    handleCloseEditForm() {
      this.isEditing = false;
    },
    addPost(post) {
      this.openedPost = post;
      this.showPostPreview = true;
      this.posts.push(post);
      this.handleCloseNewPostForm();
    },
    togglePostPreview(post) {
      if (this.openedPost === post) {
        this.openedPost = {};
        this.showPostPreview = false;
        this.isEditing = false;

        return;
      }
      this.showNewPostForm = false;
      this.openedPost = post;
      this.showPostPreview = true;
      this.isEditing = false;
    },
    deletePost(postId) {
      this.posts = this.posts.filter((post) => post.id !== postId);
      this.showPostPreview = false;
    },
    editPost(post) {
      this.posts = this.posts.map((p) => (p.id === post.id ? post : p));
      this.openedPost = post;

      this.isEditing = false;
    }
  }
};
</script>
