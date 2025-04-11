<script lang="ts">
import { getPosts } from './api/post.ts'
import AppHeader from './components/AppHeader.vue'
import AppLogin from './components/AppLogin.vue'
import AppSidebar from './components/AppSidebar.vue'
import PostList from './components/PostList.vue'
import type { Post } from './types/post.ts'
import type { User } from './types/user.ts'

export default {
  data(): {
    user: User | null
    posts: Post[]
    activePost: Post | null
    newPost: boolean
    isEditingPost: Post | null
  } {
    return {
      user: null,
      posts: [],
      activePost: null,
      newPost: false,
      isEditingPost: null,
    }
  },
  components: {
    AppHeader,
    AppLogin,
    PostList,
    AppSidebar,
  },
  mounted() {
    const userData = localStorage.getItem('user')
    if (userData) {
      this.user = JSON.parse(userData)

      if (this.user) {
        getPosts(this.user.id).then((postsFromServer) => {
          this.posts = postsFromServer
        })
      }
    }
  },
  watch: {
    user(newUser) {
      if (newUser) {
        getPosts(newUser.id).then((postsFromServer) => {
          this.posts = postsFromServer
        })
      }
    },
    newPost(newValue) {
      if (newValue) {
        this.activePost = null
        this.isEditingPost = null
      }
    },
    activePost(newValue) {
      if (newValue) {
        this.newPost = false
        this.isEditingPost = null
      }
    },
    isEditingPost(newValue) {
      if (newValue) {
        this.newPost = false
        this.activePost = null
      }
    },
  },
}
</script>

<template>
  <AppHeader v-if="user" v-model:userModel="user" />
  <AppLogin v-else v-model:userModel="user" />
  <main class="section" v-if="user">
    <div class="container">
      <div class="tile is-ancestor">
        <PostList :user="user" v-model:postModel="activePost" v-model:postsModel="posts"
          v-model:newPostModel="newPost" />
        <AppSidebar v-model:postsModel="posts" :user="user" v-model:postModel="activePost"
          v-model:newPostModel="newPost" v-model:isEditing="isEditingPost" />
      </div>
    </div>
  </main>
</template>

<style scoped></style>
