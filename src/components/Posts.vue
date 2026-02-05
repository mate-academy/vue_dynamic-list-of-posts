<script lang="ts">
import type { Post } from '../types/Posts.type';
import * as PostApi from '../api/posts'
import PostTable from './PostTable.vue'
import PostDetail from './PostDetail.vue'
import AddNewPost from './AddNewPost.vue'
import EditPost from './EditPost.vue';
import Loader from './Loader.vue';

export default {
  name: 'PostsComponent',

  components: {
    PostTable,
    PostDetail,
    AddNewPost,
    EditPost,
    Loader,
  },

  props: {
    userId: {
      required: true,
    },
  },

  data() {
    return {
      posts: [] as Post[],
      errorMessage: '',
      selectedPostId: null as number | null,
      addNewPost: false,
      isEditing: false,
      isLoading: false,
    }
  },


  mounted() {
    this.fetchPosts()
  },

  computed: {
    selectedPost(): Post | null {
      return (
        this.posts.find(
          Post => Post.id === this.selectedPostId
        ) ?? null
      )
    },

    isSidebarOpen(): boolean {
      return this.selectedPost !== null || this.addNewPost;
    }
  },

  methods: {
    togglePost(id: number) {
      this.addNewPost = false;
      this.selectedPostId =
        this.selectedPostId === id ? null : id
    },

    async fetchPosts() {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      this.isLoading = true

      try {
        this.posts = await PostApi.getAllPostsByUserId(+userId)
      } catch {
        this.errorMessage = 'Failed to load posts'
      } finally {
        this.isLoading = false
      }
    },

    async handleDeletePost(id: number) {
      this.selectedPostId = null
      this.isLoading = true

      try {
        await PostApi.deletePost(id)
        await this.fetchPosts()
      } catch {
        this.errorMessage = 'Failed to delete post'
      } finally {
        this.isLoading = false
      }
    },

    handleAddNewPost() {
      this.selectedPostId = null;
      this.addNewPost = true;
    },

    async handlePostCreated(postId: number) {
      this.addNewPost = false
      this.isLoading = true

      try {
        await this.fetchPosts()
        this.selectedPostId = postId
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<template>
  <div class="posts-layout" :class="{ 'Sidebar--open': isSidebarOpen }">
    <!-- LEFT COLUMN -->
    <section class="posts-list box">
      <header class="posts-list__header is-flex is-justify-content-space-between is-align-items-center">
        <h1 class="posts-list__title title is-4">Posts</h1>

        <button class="button is-primary" :class="{ 'is-light': addNewPost }" @click="handleAddNewPost">
          Add New Post
        </button>
      </header>

      <!-- ERROR MESSAGE -->
      <div v-if="errorMessage" class="notification is-danger is-light">
        <button class="delete" @click="errorMessage = ''"></button>
        {{ errorMessage }}
      </div>

      <Loader v-if="isLoading" />

      <p v-else-if="posts.length === 0 && isLoading === false" class="has-text-centered has-text-grey">
        No posts yet.
      </p>

      <PostTable v-else-if="!isLoading && posts.length > 0" :posts="posts" :selectedPostId="selectedPostId"
        :togglePost="togglePost" />
    </section>

    <!-- RIGHT COLUMN -->
    <transition name="slide-fade" mode="out-in">
      <section v-if="isEditing" key="edit" class="sidebar box">
        <EditPost :selectedPost="selectedPost" @close="isEditing = false" @post-updated="fetchPosts" />
      </section>

      <section v-else-if="selectedPost" key="detail" class="sidebar box">
        <PostDetail :selectedPost="selectedPost" @deleted="handleDeletePost" @close="selectedPostId = null"
          @edit="isEditing = true" />
      </section>

      <section v-else-if="addNewPost" key="add" class="sidebar box">
        <AddNewPost :addNewPost="addNewPost" @close="addNewPost = false" @post-created="handlePostCreated" />
      </section>
    </transition>
  </div>
</template>
