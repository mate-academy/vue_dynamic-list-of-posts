<!-- eslint-disable vue/no-reserved-component-names -->
<script>
  import Header from './components/Header.vue';
  import PostsList from './components/PostList.vue';
  import Sidebar from './components/Sdebar.vue'
  export default {
    name: 'App',
    data() {
      return {
        posts: [],
        sidebarOpened: false,
        previewPost: null,
      }
    },
    components: {
      Header,
      PostsList,
      Sidebar,
    },
    methods: {
      handleCreating(post) {
        const { title, body } = post;
        const newPostid = this.posts.length 
          ? Math.max(...this.posts.map(({ id }) => id)) + 1
          : 1;
        const newPost = {
          id: newPostid,
          title,
          body,
          comments: [],
        }
        this.posts.push(newPost);
        this.previewPost = newPost;
      },
      handlePreviewToggle(post) {
        console.log('toggle', !!post);
        if (!post) {
          this.sidebarOpened = false;
          this.previewPost = null
          return;
        }
        this.sidebarOpened = true;
        this.previewPost = post; 
      },
      handlePostRemoving(postId) {
        this.posts = this.posts.filter(({ id }) => id !== postId);
        this.handlePreviewToggle();
      },
      handlePostUpdating(updatedPost) {
        const post = this.posts.find(({ id }) => id === updatedPost.id);
  
        Object.assign(post, updatedPost);
      }
    },
  } 
</script>

<template>
  <Header />
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <PostsList 
          :posts="this.posts"
          :previewId="previewPost?.id"
          @addNew="sidebarOpened = true; previewPost = null"
          @togglePreview="handlePreviewToggle"
        />
        <Sidebar 
          :isOpen="sidebarOpened" 
          :previewPost="previewPost"
          @close="sidebarOpened = false"
          @postCreating="handleCreating"
          @postRemoving="handlePostRemoving"
          @postUpdating="handlePostUpdating"
        />
      </div>
    </div>
  </main>
</template>