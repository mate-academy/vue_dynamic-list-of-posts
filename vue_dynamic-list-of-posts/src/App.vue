<!-- eslint-disable vue/no-reserved-component-names -->
<script>
  import Header from './components/Header.vue'
  import PostsList from './components/PostList.vue';
  import Sidebar from './components/Sidebar.vue'

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
        const updatedPostIndex = this.posts.findIndex((post) => post.id === updatedPost.id);
        this.posts.splice(updatedPostIndex, 1, updatedPost);
        this.previewPost = updatedPost;
      }
    },
    updated() {
      // const { sidebarOpened: postFormOpened, posts, previewPost } = this;
      
      // console.log(postFormOpened, posts, previewPost);
    }
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