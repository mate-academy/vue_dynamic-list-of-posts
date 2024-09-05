<script>
import PostList from './components/PostList.vue';
import AppHeader from './components/AppHeader.vue';
import Loader from './components/Loader.vue';
import Sidebar from './components/Sidebar.vue';
import PostForm from './components/PostForm.vue';
import { getPosts } from './api/posts';

export default {
  data() {
    return {
      posts: [],
      errorMessages: '',
      loader: true,
      sidebar: false,
    }
  },
  components: {
    PostList,
    AppHeader,
    Loader,
    Sidebar,
    PostForm,
  },
  mounted() {
    getPosts().then(({ data }) => {
      this.posts = data;
      this.loader = false;
    })
      .catch(() => {
        this.errorMessages = 'Unable to load todos';
        this.loader = false;
      })
  }
}
</script>

<template>
  <AppHeader />

  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <PostList :posts="posts" :loader="loader" :errorMessages="errorMessages" @sidebar:change="sidebar = $event" />
        <Sidebar #default :sidebar="sidebar">
          <PostForm />
        </Sidebar>
      </div>
    </div>
  </main>

</template>

<style></style>
