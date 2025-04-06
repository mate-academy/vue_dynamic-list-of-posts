<script>
import 'bulma/css/bulma.min.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import LoginComponent from './components/Login/LoginComponent.vue'
import PostsComponent from './components/Posts/PostsComponent.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import SidebarComponent from './components/Sidebar/SidebarComponent.vue'

export default {
  components: {
    LoginComponent,
    SidebarComponent,
    HeaderComponent,
    PostsComponent,
  },

  data() {
    return {
      selectedPost: null,
      showSidebar: false,
    }
  },

  computed: {
    isAuthorized() {
      return this.$store.state.auth.user
    },
  },

  mounted() {
    this.showSidebar = false
    this.selectedPost = null
  },

  methods: {
    closeSidebar() {
      this.showSidebar = false
      this.selectedPost = null
    },

    showSelectedPost(post) {
      this.selectedPost = post
      this.showSidebar = true
    },
    addNewPost() {
      this.selectedPost = null
      this.showSidebar = true
    },
  },
}
</script>

<template>
  <LoginComponent v-if="!isAuthorized" />

  <template v-else>
    <main class="section">
      <HeaderComponent class="pb-5" />
      <div class="container">
        <div class="tile is-ancestor">
          <PostsComponent
            :show-sidebar="showSidebar"
            :selected-post="selectedPost"
            @add-new-post="addNewPost"
            @show-selected-post="showSelectedPost"
          />
          <SidebarComponent
            v-if="showSidebar"
            :show-sidebar="showSidebar"
            :selected-post="selectedPost"
            @close-Sidebar="closeSidebar"
          />
        </div>
      </div>
    </main>
  </template>
</template>

<style scoped></style>
