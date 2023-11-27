<script>
import { getCommentsOfPost } from '../../api/comments';
import { getUserPosts, updatePost, createPost, deletePost } from '../../api/posts.js';
import AppHeader from './AppHeader.vue';
import AppLoader from './AppLoader.vue';
import PostDetails from './PostDetails.vue';
import PostForm from './PostForm.vue';
import PostsBlock from './PostsBlock.vue';

export default {
  name: 'AppPostsPage',
  data() {
    return {
      selectedPost: null,
      editingPost: null,
      isFormShown: false,
      arePostsLoading: true,
      postComments: [],
      posts: [],
    }
  },
  props: {
    user: Object,
  },
  methods: {
    async togglePost(newPost) {
      this.isFormShown = false;
      this.editingPost = null;

      if (this.selectedPost && this.selectedPost.id === newPost.id) {
        this.selectedPost = null;
      } else {
        this.selectedPost = newPost;
      }
    },
    editPost(post) {
      this.isFormShown = true;
      this.selectedPost = null;

      this.editingPost = post;
    },
    closeForm() {
      this.isFormShown = false;
      this.editingPost = null;
    },
    handleResponse(response) {
      this.closeForm();
      this.loadPosts();
      this.selectedPost = response.data;
    },
    updateCurrentPost(data) {
      updatePost({
        id: this.editingPost.id,
        title: data.title,
        body: data.body,
      }).then(this.handleResponse);
    },
    createNewPost(data) {
      console.log(data);
      createPost({
        userId: this.user.id,
        title: data.title,
        body: data.body,
      }).then(this.handleResponse);
    },
    deleteCurrentPost() {
      deletePost(this.selectedPost.id)
        .then(() => this.loadPosts());
      this.selectedPost = null;
    },
    loadPosts() {
      this.arePostsLoading = true;

      getUserPosts(this.user.id)
        .then(response => this.posts = response)
        .finally(() => this.arePostsLoading = false);
    },
  },
  mounted() {
    this.loadPosts();
  },
  components: { AppHeader, PostsBlock, PostDetails, PostForm, AppLoader }
}
</script>

<template>
  <div class="is-flex content__box">
    <PostsBlock 
      @selectPost="togglePost" 
      :posts="posts"
      :selectedPost="selectedPost"
      @showForm="editPost"
      :isFormShown="isFormShown"
      :editingPost="editingPost"
      :arePostsLoading="arePostsLoading"
    />

    <div 
      class="tile is-parent is-8-desktop Sidebar" 
      :class="{ 'Sidebar--open': this.selectedPost || this.isFormShown }"
    >
      <div className="tile is-child box is-success ">
        <div className="content">
          <PostDetails 
            :post="this.selectedPost" 
            v-if="this.selectedPost"
            @showForm="editPost"
            @deletePost="deleteCurrentPost"
          />

          <PostForm 
            :editingPost="this.editingPost"
            @updatePost="updateCurrentPost"
            @createPost="createNewPost"
            @closeForm="closeForm"
            v-if="this.isFormShown"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}

.content__box {
  gap: 5px;
  margin-inline: 60px;
  margin-top: 40px;
}
</style>