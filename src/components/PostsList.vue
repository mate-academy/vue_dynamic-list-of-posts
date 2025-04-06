<script>
import { getPostsByUserId, removePost, createPost, updatePost } from '@/api/posts'
import Loader from './Loader.vue'
import Sidebar from './Sidebar.vue'

export default {
  name: 'PostsList',
  components: {
    Loader,
    Sidebar,
  },
  props: {
    userId: Number,
  },
  data() {
    return {
      posts: [],
      isLoading: false,
      selectedPost: {},
      isSidebarActive: false,
    }
  },
  mounted() {
    this.isLoading = true

    getPostsByUserId(this.userId)
      .then(({ data }) => {
        this.posts = data
      })
      .finally(() => {
        this.isLoading = false
      })
  },
  methods: {
    handleAddPost() {
      this.isSidebarActive = true
      this.selectedPost = {}
    },
    handleSelectPost(post) {
      this.isSidebarActive = true
      this.selectedPost = { ...post }
    },
    handleCloseSidebar() {
      this.selectedPost = {}
      this.isSidebarActive = false
    },
    handleDeletePost(postId) {
      removePost(postId).then(() => {
        this.posts = this.posts.filter((post) => post.id !== postId)
        this.isSidebarActive = false
      })
    },
    handleCreatePost(newPost) {
      const userId = this.userId
      createPost({ ...newPost, userId }).then(({ data }) => {
        this.posts.push(data)
        this.selectedPost = this.posts[this.posts.length - 1]
      })
    },
    handleUpdatePost(postToUpdate) {
      const userId = this.userId
      updatePost(postToUpdate.id, { ...postToUpdate, userId }).then(({ data }) => {
        this.posts = this.posts.map((post) => {
          if (post.id === data.id) {
            return data
          }

          return post
        })
        this.selectedPost = this.posts.find((post) => post.id === data.id)
      })
    },
  },
}
</script>

<template>
  <div class="tile is-parent is-flex-grow-1">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="handleAddPost">Add New Post</button>
        </div>

        <!-- Loader -->
        <div class="is-flex is-justify-content-center is-align-items-center mt-2" v-if="isLoading">
          <Loader />
        </div>

        <p
          class="is-flex is-justify-content-center is-align-items-center mt-2"
          v-else-if="!isLoading && posts.length === 0"
        >
          No posts yet
        </p>

        <!-- Posts Table -->
        <table class="table is-fullwidth is-striped is-hoverable is-narrow" v-else>
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post of posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': post.id !== selectedPost.id }"
                  @click="
                    post.id === selectedPost.id ? handleCloseSidebar() : handleSelectPost(post)
                  "
                >
                  {{ post.id !== selectedPost.id ? 'Open' : 'Close' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Sidebar
    class="is-flex-grow-1"
    :isActive="isSidebarActive"
    :selectedPost="selectedPost"
    @deletePost="handleDeletePost"
    @createPost="handleCreatePost"
    @updatePost="handleUpdatePost"
    @closeSidebar="handleCloseSidebar"
  />
</template>
