<script>
import { addPost, deletePost, getPosts, updatePost } from './api/posts'
import AddPost from './components/AddPost.vue'
import EditPost from './components/EditPost.vue'
import HeaderPage from './components/Header.vue'
import LoginPage from './components/LoginPage.vue'
import PostList from './components/PostList.vue'
import PostPreview from './components/PostPreview.vue'

export default {
  components: {
    LoginPage,
    PostList,
    HeaderPage,
    AddPost,
    PostPreview,
    EditPost,
  },
  data() {
    return {
      posts: [],
      errorMessage: '',
      isCreated: false,
      currentPost: null,
      editedPost: null,
      isLoading: false,
    }
  },
  mounted() {
    this.isLoading = true
    getPosts()
      .then(({ data }) => {
        this.posts = data
      })
      .catch(() => (this.errorMessage = 'Unable to load posts'))
      .finally(() => (this.isLoading = false))
  },
  methods: {
    handleOpen() {
      this.isCreated = true
      this.currentPost = null
    },

    handleClose() {
      this.isCreated = false
      this.currentPost = this.editedPost
      this.editedPost = null
    },

    handleOpenPost(post) {
      this.currentPost = post
      this.isCreated = false
      this.editedPost = null
    },
    handleDeletePost(postId) {
      deletePost(postId)
        .then(() => (this.posts = this.posts.filter((post) => post.id !== postId)))
        .catch(() => (this.errorMessage = 'Unable to delete post'))
        .finally(() => (this.currentPost = null))
    },

    handleEditPost() {
      this.editedPost = this.currentPost
      this.currentPost = null
    },

    handleUpdatePost(post) {
      updatePost(post)
        .then(({ data }) => {
          this.posts = this.posts.map((p) => (p.id !== post.id ? p : data))
          this.editedPost = null
          this.currentPost = data
        })
        .catch(() => (this.errorMessage = 'Unable to edit post'))
    },

    handleAddPost(post) {
      addPost(post)
        .then(({ data }) => {
          this.posts = [...this.posts, data]
          this.isCreated = false
          this.currentPost = data
          console.log(data, this.isCreated)
        })
        .catch(() => (this.errorMessage = 'Unable to create post'))
    },
  },
}
</script>

<template>
  <HeaderPage />
  <main>
    <div class="container">
      <div class="tile is-ancestor">
        <PostList
          :isLoading="isLoading"
          :posts="posts"
          :open="handleOpen"
          :openPost="handleOpenPost"
        />
        <AddPost :isCreated="isCreated" :close="handleClose" :createPost="handleAddPost" />
        <EditPost
          v-if="editedPost"
          :post="editedPost"
          :close="handleClose"
          :editPost="handleUpdatePost"
        />
        <PostPreview
          v-if="currentPost"
          :post="currentPost"
          :deletePost="handleDeletePost"
          :edit="handleEditPost"
        />
      </div>
    </div>
  </main>
  <LoginPage v-if="false" />
</template>

<style>
@media screen and (min-width: 769px), print {
  .tile:not(.is-child) {
    display: flex;
  }
}

.tile.is-ancestor {
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
  gap: 40px;
}

.tile.is-ancestor:last-child {
  margin-bottom: -0.75rem;
}

.tile {
  align-items: stretch;
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: -webkit-min-content;
  min-height: -moz-min-content;
  min-height: min-content;
}
</style>
