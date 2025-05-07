<script>
import HeaderPage from './components/HeaderPage.vue';
import PostsList from './components/PostsList.vue';
import PostPreview from './components/PostPreview.vue';
import PostForm from './components/PostForm.vue';
import { getPosts } from './api/post';

export default {
  name: 'App',
  components: {
    HeaderPage,
    PostsList,
    PostPreview,
    PostForm,
  },
  data() {
    return {
      previewId: 0,
      statusForm: 'off',
      posts: [],
      updatePost: null,
      isLoading: false,
    }
  },
  mounted() {
    this.getPostsData();
  },
  methods: {
    async getPostsData() {
      this.isLoading = true;
      const { data } = await getPosts();
      this.posts = data;
      this.isLoading = false;
    },
    onUpdatingPost(post) {
      this.updatePost = post;
      this.statusForm = 'update';
      this.previewId = 0;
    },
  }
}
</script>

<template>
  <header>
    <HeaderPage />
  </header>
  <main class="section">
    <div class="container">
      <div className="tile is-ancestor">
        <PostsList
          :statusForm="statusForm"
          :posts="posts"
          :previewId="previewId"
          :isLoading="isLoading"
          @update-preview-id="previewId = $event; statusForm = 'off'"
          @update-status-form="statusForm = $event; previewId = 0"
        />

        <div
          class="tile is-parent is-8-desktop Sidebar"
          :class="{
            'Sidebar--open': previewId !== 0 || statusForm !== 'off',
          }"
        >
          <div class="tile is-child box is-success">
            <div class="content">
              <PostPreview
                v-if="previewId !== 0 && posts.find(post => post.id === previewId)"
                :post="posts.find(post => post.id === previewId)"
                @on-updating-post="onUpdatingPost($event)"
                @update-posts="getPostsData(); previewId = 0"
              />

              <PostForm
                v-if="statusForm === 'create'"
                :status="statusForm"
                @update-status-form="statusForm = $event"
                @update-preview-id="previewId = $event; statusForm = 'off'"
                @update-posts="getPostsData()"
              />

              <PostForm
                v-if="statusForm === 'update'"
                :status="statusForm"
                :post="updatePost"
                @update-status-form="statusForm = $event"
                @update-preview-id="previewId = $event; statusForm = 'off'"
                @update-posts="getPostsData()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
