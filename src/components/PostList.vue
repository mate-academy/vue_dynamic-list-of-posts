<script>
import { getPostsByUserId, addPost, deletePost, updatePost } from '../api/posts';
import Post from "./Post.vue";
import Sidebar from "./Sidebar.vue";
import Loader from "./Loader.vue";
import PostPreview from "./PostPreview.vue";
import PostForm from "./PostForm.vue";
export default {
  name: 'PostList',
  components: {
    Post,
    Sidebar,
    PostPreview,
    PostForm,
    Loader,
  },
  props: {
    userId: Number,
  },
  data() {
    return {
      posts: [],
      currentPostId: 0,
      loading: false,
      error: '',
      showPostForm: false,
      isEditing: false,
    };
  },
  mounted() {
    this.getPosts();
  },
  computed: {
    activePost() {
      return this.posts.find(post => post.id === this.currentPostId);
    },
  },
  methods: {
    openSidebar(postId) {
      if (this.currentPostId === postId) {
        this.currentPostId = 0;
      } else {
        this.currentPostId = postId;
      }
      this.showPostForm = false;
      this.isEditing = false;
    },
    getPosts(){
      this.loading = true;
      getPostsByUserId(this.userId)
        .then((res) => {
          console.log(res.data);
          this.posts = res.data;
        })
        .catch((err) => {
          this.error = err.message;
        })
        .finally(() => {
          this.loading = false;
        })
    },
    addNewPost(data) {
      addPost({...data, userId: this.userId})
        .then((res) => {
          this.posts.push(res.data);
          this.currentPostId = res.data.id;
          this.showPostForm = false;
        })
    },
    editPost(data) {
  updatePost(this.currentPostId, { ...data, userId: this.userId })
    .then((res) => {
      const postIndex = this.posts.findIndex(post => post.id === this.currentPostId);
      if (postIndex !== -1) {
        this.posts[postIndex] = { ...this.posts[postIndex], ...res.data };
      }
      this.isEditing = false;
    })
    .catch(err => {
      console.error(err);
      this.error = err.message;
    });
}
,
    removePost(postId) {
      this.currentPostId = 0;
      deletePost(postId)
        .then((res) => {
          this.posts = this.posts.filter((post) => post.id !== postId);
        })
    },
    closeForm() {
      this.showPostForm = false;
      this.isEditing = false;
    },
    openPostForm() {
      this.showPostForm = true;
      this.currentPostId = 0;
    },
    showEditForm() {
      this.isEditing = true;
    }
  },
}
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">

      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link" @click="openPostForm">Add New Post</button>
        </div>
        <div v-if="loading" class="is-flex is-justify-content-center">
          <Loader />
        </div>
        <div v-else v-if="posts.length === 0" class="is-flex is-justify-content-center">No posts yet.</div>
        <table v-else class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <Post 
              v-for="post in posts" 
              :key="post.id" 
              :post="post" 
              @open-sidebar="openSidebar"
              :current-post-id="currentPostId"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Sidebar class="sidebar" :class="{ 'sidebar--open': currentPostId !== 0 || showPostForm || isEditing }">
    <PostForm 
      v-if="showPostForm" 
      :editing="isEditing"
      @close-form="closeForm" 
      @submit-handler="addNewPost"
    />

    <PostForm 
      v-if="isEditing" 
      :editing="isEditing"
      @close-form="closeForm" 
      @submit-handler="editPost"
      :post="activePost"
    />

    <PostPreview 
      v-if="currentPostId !== 0 && !showPostForm && !isEditing" 
      :post="activePost" 
      @delete-post="removePost"
      @edit-post="showEditForm"
    />

  </Sidebar>
</template>
