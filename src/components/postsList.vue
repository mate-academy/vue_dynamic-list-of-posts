<script>
import { deletePost, getPosts, updatePost } from '../api/posts';
import ErrorMessage from './ErrorMessage.vue';
import Loader from './Loader.vue';
import PostForm from './postForm.vue';
import PostItem from './postItem.vue';
import PostPreview from './postPreview.vue';

export default {
  name: 'postList',
  components: {
    Loader,
    PostForm,
    PostPreview,
    PostItem,
    ErrorMessage,
  },
  data() {
    return {
      posts: [],
      sidebar: false,
      postPreview: false,
      selectedPost: {},
      editing: false,
      loading: false,
      errorMessage: false,
    }
  },
  props: {
    user: {},
  },
  mounted() {
    this.loading = true;
    getPosts().then(({ data }) => { this.posts = data }).catch(() => this.errorMessage = true).finally(() => this.loading = false);
  },
  methods: {
    handleSidebar() {
      if (this.sidebar && !this.editing) {
        this.sidebar = false;
        this.editing = false;
      } else if (this.sidebar && this.editing) {
        this.editing = false;
        this.sidebar = false;
      } else {
        this.sidebar = true;
        this.postPreview = false;
        this.editing = false;
        this.selectedPost = {};
      }
    },
    handlePostButton(post) {
      if (this.selectedPost === post) {
        this.selectedPost = {};
        this.postPreview = false;
        this.editing = false;
        this.sidebar = false;
      } else {
        this.selectedPost = post;
        this.postPreview = true;
        this.editing = false;
        this.sidebar = false;
      }
    },
    deletePost(postId) {
      deletePost(postId)
      this.posts = this.posts.filter(item => item.id !== postId);
      this.postPreview = false;
    },
    updatePost({ postId, title, body }) {
      updatePost({ postId, title, body }).then(({ data }) => {
        this.posts = this.posts.map(post => {
          if (post.id === postId) {
            post = { ...data }
            return { ...data }
          } else {
            return post;
          }
        })
      }).finally(() => this.loading = false)
    },
    handleEditing() {
      this.sidebar = true;
      this.editing = true;
    }
  }
}
</script>

<template>
  <div className="tile is-parent">
    <div className="tile is-child box is-success">
      <div className="block">
        <div className="block is-flex is-justify-content-space-between">
          <p className="title">Posts</p>
          <button type="button" class="button is-link" :class="{ 'is-light': sidebar && !editing }"
            @click="handleSidebar">
            Add New Post
          </button>
        </div>

        <Loader v-if="loading" />
        <ErrorMessage v-if="errorMessage" :props="'posts'" @close="errorMessage = false"/>

        <template v-if="posts.length > 1 && !loading" v-for="post of posts">
          <table className="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
              <tr className="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th className="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <PostItem :post="post" :selectedPost="selectedPost" @handlePostButton="handlePostButton(post)"
                :key="post.id" />
            </tbody>
          </table>

        </template>

        <template v-if="posts.length === 0 && !loading">
          <div className="block">
            <h3 className="mt-2 has-text-centered">No posts yet.</h3>
          </div>
        </template>
      </div>
    </div>
  </div>
  <postPreview v-if="postPreview && !sidebar" :post="selectedPost" @deletePost="deletePost"
    @handleEditing="handleEditing" />
  <PostForm :sidebar="sidebar" @handleSidebar="handleSidebar" @updatePost="updatePost" v-if="sidebar"
    :post="selectedPost" :editing="editing" />
</template>
