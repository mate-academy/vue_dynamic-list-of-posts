<script>
import { destroyPost, getComments, getPosts } from "@/http-client";
import Comment from "./Comment.vue";
import PostPreview from "./PostPreview.vue";
import Sidebar from "./Sidebar.vue";
import AddPost from "./AddPost.vue";

import Loader from "./Loader.vue";

export default {
  name: "PostsList",
  components: {
    Loader,
    Sidebar,
    PostPreview,
    Comment,
    AddPost,
  },

  props: ["user"],

  data() {
    return {
      isLoadingPosts: true,
      posts: [],
      currentPost: null,
      comments: [],
      areCommentsLoading: false,
      isWritingPost: false,
    };
  },
  methods: {
    selectPost(post) {
      if (this.currentPost !== null) {
        this.currentPost = null;
        return;
      }
      this.currentPost = post;
    },
    clearComments() {
      this.comments = [];
    },
    addPost(post) {
      this.posts.push(post);
    },
    deletePost(postId) {
      // Delete post from API
      destroyPost(postId)
        .then(() => {
          // Delete post from posts list
          const index = this.posts.findIndex((post) => post.id === postId);
          this.posts.splice(index, 1);
          this.currentPost = null;
        })
        .catch((error) => console.log("Could not delete the post:", error));
    },
  },
  watch: {
    currentPost() {
      if (this.currentPost === null) {
        this.clearComments();
      }
    },
  },
  mounted() {
    if (this.user) {
      getPosts(this.user.id)
        .then((response) => {
          this.posts = response.data;
        })
        .catch((error) => {
          console.warn(error);
          alert(error);
        })
        .finally(() => (this.isLoadingPosts = false));
    }
  },

  watch: {
    currentPost() {
      if (this.isWritingPost === true && this.currentPost !== null) {
        this.isWritingPost = false;
      }

      if (this.currentPost) {
        this.areCommentsLoading = true;

        getComments(this.currentPost.id)
          .then((response) => {
            this.comments = response.data;
            console.log("comments:", response.data);
          })
          .catch((error) => console.log("Error:", error))
          .finally(() => {
            this.areCommentsLoading = false;
          });
      }
    },
    isWritingPost() {
      if (this.isWritingPost === true && this.currentPost !== null) {
        this.currentPost = null;
      }
    },
  },

  computed: {
    isSidebarOpen() {
      return this.currentPost !== null;
    },
  },
};
</script>

<template>
  <Loader v-if="this.isLoadingPosts" />

  <div v-else="true" class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            @click="isWritingPost = true"
            type="button"
            class="button is-link"
          >
            Add New Post
          </button>
        </div>
        <table
          v-if="!!this.posts.length"
          class="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post of posts">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  @click="selectPost(post)"
                >
                  Open
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!this.posts.length"></p>
      </div>
    </div>
  </div>

  <Sidebar v-if="isSidebarOpen" :class="{ 'Sidebar--open': isSidebarOpen }">
    <PostPreview :post="this.currentPost" :deletePost="deletePost" />
    <Loader v-if="areCommentsLoading" />
    <Comment
      v-if="!areCommentsLoading"
      v-for="comment of this.comments"
      :comment="comment"
    />
  </Sidebar>

  <AddPost
    v-if="this.isWritingPost"
    v-model="isWritingPost"
    :user="user"
    :addPost="addPost"
  />
</template>

<style></style>
