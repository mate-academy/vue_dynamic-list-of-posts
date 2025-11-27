<script>
import { getPosts, updatePost, deletePost } from '../api/posts'
import PostItem from './PostItem.vue'
import PostSidebar from './PostSidebar.vue'
import PostLoader from './PostLoader.vue'

export default {
  name: 'PostsList',
  components: {
    PostItem,
    PostSidebar,
    PostLoader,
  },
  props: {
    userId: Number,
  },
  data() {
    return {
      posts: [],
      selectedPost: {},
      isActiveSidebar: false,
      loading: false,
      errorMessage: '',
    }
  },
  mounted() {
    this.loading = true
    getPosts(this.userId)
      .then(({ data }) => {
        this.posts = data
      })
      .catch(() => {
        this.errorMessage = "Can't download post"
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    handleOpenSidebar() {
      this.isActiveSidebar = true
    },

    handleCloseSidebar() {
      this.isActiveSidebar = false
    },

    handleOpenPost(post) {
      this.selectedPost = { ...post }
      this.handleOpenSidebar()
    },

    handleClosePost() {
      this.selectedPost = {}
      this.handleCloseSidebar()
    },

    handleAddNewPost() {
      this.selectedPost = {};
      this.isActiveSidebar = true;
    },

    addPost(newPost) {
      this.posts.push(newPost);
      this.selectedPost = { ...newPost };
      this.isActiveSidebar = true;
    },

    updatePost({ postId, title, body }) {
      updatePost({ postId, title, body }).then(({ data }) => {
        this.posts = this.posts.map((post) => {
          if (post.id !== postId) {
            return post
          } else {
            this.selectedPost = { ...data }
            return { ...data }
          }
        })
      })
      .catch(() => {
        this.errorMessage = `Can't update post #${postId}. Please try again.`;
      })
    },

    deletePost(postId) {
      this.errorMessage = '';
      deletePost(postId)
      .then(() => {
        this.posts = this.posts.filter((post) => post.id !== postId)
        this.selectedPost = {}
        this.isActiveSidebar = false
      })
      .catch(() => {
        this.errorMessage = `Can't delete post #${postId}. Please try again.`;
      });
    },
  },
}
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            :class="{
              'is-light': isActiveSidebar && !selectedPost.hasOwnProperty('id'),
            }"
            @click="handleAddNewPost"
          >
            Add New Post
          </button>
        </div>

        <PostLoader v-if="loading"/>

        <div v-else-if="!loading && errorMessage" class="is-error is-danger notification">
          {{ errorMessage }}
        </div>

        <h3 v-else-if="!loading && !errorMessage && !posts.length" class="mt-2 has-text-centered">
          No posts yet.
        </h3>

        <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <PostItem
              v-for="post of posts"
              :key="post.id"
              :post="post"
              :selectedPost="selectedPost"
              @openPost="handleOpenPost"
              @closePost="handleClosePost"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <PostSidebar
    :isActive="isActiveSidebar"
    :userId="userId"
    :selectedPost="selectedPost"
    @closeSidebar="handleCloseSidebar"
    @addPost="addPost($event)"
    @deletePost="deletePost($event)"
    @updatePost="updatePost($event)"
  />
</template>

<style></style>
