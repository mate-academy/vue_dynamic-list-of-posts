<script>
import { getPosts } from '../api/api';
import Sidebar from './Sidebar.vue';
import Loader from './Loader.vue';
import NewPost from './NewPost.vue';
import PostDetailes from './PostDetailes.vue';
import EditPost from './EditPost.vue';

export default {
  name: 'PostsList',
  components: {
    Sidebar,
    Loader,
    NewPost,
    EditPost,
    PostDetailes,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      posts: [],
      selectedPost: null,
      isLoadingPosts: false,
      isPostAdd: false,
      arePostDetailesVisible: false,
      isPostEdit: false,
    };
  },

  async mounted() {
    await this.loadPosts();
  },

  methods: {
    async loadPosts() {
      this.isLoadingPosts = true;
      try {
        const { data } = await getPosts(this.user.id);
        this.posts = data;
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        this.isLoadingPosts = false;
      }
    },
    async handlePostCreated(newPost) {
      await this.loadPosts();

      this.selectedPost = newPost;
      this.arePostDetailesVisible = true;
    },
    handleOpenPostAdd() {
      this.isPostAdd = true;
      this.selectedPost = null;
      this.arePostDetailesVisible = false;
      this.isPostEdit = false;
    },
    handlePostDeleted(postId) {
      this.posts = this.posts.filter((post) => post.id !== postId);
      if (this.selectedPost && this.selectedPost.id === postId) {
        this.selectedPost = null;
        this.arePostDetailesVisible = false;
      }
    },
    openPostDetailes(post) {
      this.isPostAdd = false;
      if (this.selectedPost && this.selectedPost.id === post.id) {
        this.selectedPost = null;
        this.arePostDetailesVisible = false;
      } else {
        this.selectedPost = post;
        this.arePostDetailesVisible = true;
      }
    },
    startEditPost() {
      this.isPostEdit = true;
      this.arePostDetailesVisible = false;
    },
    async handlePostUpdated(updatedPost) {
      await this.loadPosts();
      this.selectedPost = updatedPost;
      this.isPostEdit = false;
      this.arePostDetailesVisible = true;
    },
    cancelEdit() {
      this.isPostEdit = false;
      this.arePostDetailesVisible = true;
    },
  },
};
</script>

<template>
  <main class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <div class="block is-flex is-justify-content-space-between">
                <p class="title">Posts</p>
                <button
                  type="button"
                  class="button is-link"
                  :class="{ 'is-light': isPostAdd }"
                  @click="handleOpenPostAdd"
                >
                  Add New Post
                </button>
              </div>

              <div
                v-if="isLoadingPosts"
                class="is-flex is-justify-content-center is-align-items-center mt-2"
              >
                <Loader />
              </div>

              <table
                class="table is-fullwidth is-striped is-hoverable is-narrow"
                v-else-if="posts.length > 0"
              >
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
                        :class="{
                          'is-light': !(
                            selectedPost && selectedPost.id === post.id
                          ),
                        }"
                        @click="openPostDetailes(post)"
                      >
                        {{
                          selectedPost && selectedPost.id === post.id
                            ? 'Close'
                            : 'Open'
                        }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3 class="mt-2 has-text-centered" v-else>No posts yet</h3>
            </div>
          </div>
        </div>
        <Sidebar
          class="Sidebar"
          :class="{
            'Sidebar--open': isPostAdd || arePostDetailesVisible || isPostEdit,
          }"
        >
          <template #createPost v-if="isPostAdd">
            <NewPost
              :user="user"
              v-model:isPostAdd="isPostAdd"
              @post-created="handlePostCreated"
            />
          </template>
          <template #editPost v-if="isPostEdit">
            <EditPost
              :post="selectedPost"
              @cancel-edit="cancelEdit"
              @post-updated="handlePostUpdated"
            />
          </template>
          <template #postDetailes v-if="arePostDetailesVisible && selectedPost">
            <PostDetailes
              :post="selectedPost"
              @post-deleted="handlePostDeleted"
              @edit-post="startEditPost"
            />
          </template>
        </Sidebar>
      </div>
    </div>
  </main>
</template>
