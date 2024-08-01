<script>
import {
  destroyComment,
  destroyPost,
  getComments,
  getPosts,
} from "@/http-client";
import Comment from "./Comment.vue";
import PostPreview from "./PostPreview.vue";
import Sidebar from "./Sidebar.vue";
import AddPost from "./AddPost.vue";

import Loader from "./Loader.vue";
import WriteCommentBtn from "./WriteCommentBtn.vue";
import CommentForm from "./CommentForm.vue";

export default {
  name: "PostsList",
  components: {
    Loader,
    Sidebar,
    PostPreview,
    Comment,
    AddPost,
    WriteCommentBtn,
    CommentForm,
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
      isEditingPost: false,
      isWritingComment: false,
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
      this.currentPost = post;
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
    editPost(newPost) {
      const index = this.posts.findIndex((post) => post.id === newPost.id);
      this.posts[index] = newPost;

      this.isWritingPost = false;
      this.isEditingPost = false;
    },
    addComment(comment) {
      this.comments.push(comment);
      this.isWritingComment = false;
    },
    deleteComment(commentId) {
      destroyComment(commentId).then(() => {
        const index = this.comments.findIndex(
          (comment) => comment.id === commentId
        );
        this.comments.splice(index, 1);
      });
    },
    showSidebar() {
      this.isSidebarOpen = true;
    },
    hideSidebar() {
      this.isSidebarOpen = false;
    },
  },
  watch: {
    currentPost() {
      if (this.currentPost === null) {
        this.clearComments();
      }
    },
    isEditingPost() {
      if (this.isEditingPost) {
        this.isWritingPost = false;
      }
    },
    isWritingPost() {
      if (this.isWritingPost) {
        this.isEditingPost = false;
      }
    },
  },
  computed: {
    isSidebarOpen() {
      return (
        this.currentPost !== null ||
        this.isEditingPost ||
        this.isWritingComment ||
        this.isWritingPost
      );
    },
    isPostPreviewOpen() {
      return (
        this.currentPost !== null &&
        this.isWritingPost === false &&
        this.isEditingPost === false
      );
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
          alert("Error while fetching the posts", error);
        })
        .finally(() => {
          console.log("------FINISH-----");
          this.isLoadingPosts = false;
        });
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
      if (this.isWritingPost) {
        this.isWritingComment = false;
        this.comments = [];
      }
    },
    isWritingComment() {
      if (this.isWritingComment) {
        this.isWritingPost = false;
      }
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
            @click="this.isWritingPost = true"
            type="button"
            class="button is-link"
            :class="this.isWritingPost ? 'is-light' : ' '"
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
            <tr v-for="post of posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button is-link"
                  :class="post.id !== currentPost?.id ? 'is-light' : ''"
                  @click="selectPost(post)"
                >
                  {{ post.id === currentPost?.id ? "Close" : "Open" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!this.posts.length"></p>
      </div>
    </div>
  </div>

  <Sidebar
    v-if="isSidebarOpen"
    class="Sidebar"
    :class="{ 'Sidebar--open': isSidebarOpen }"
  >
    <PostPreview
      v-if="isPostPreviewOpen"
      :post="this.currentPost"
      :deletePost="deletePost"
      v-model="this.isEditingPost"
    />

    <Loader v-if="areCommentsLoading" />

    <Comment
      v-if="!areCommentsLoading && !isEditingPost"
      v-for="comment of this.comments"
      :comment="comment"
      :deleteComment="this.deleteComment"
    />

    <WriteCommentBtn
      v-model="isWritingComment"
      v-if="isPostPreviewOpen && !this.isWritingComment"
    />
    <CommentForm
      v-if="this.isWritingComment"
      v-model="isWritingComment"
      :addComment="addComment"
      :postId="this.currentPost.id"
    />

    <AddPost
      v-if="this.isWritingPost || this.isEditingPost"
      v-model="isWritingPost"
      :user="user"
      :addPost="addPost"
      :is-editing="isEditingPost"
      :editPost="editPost"
      :post="currentPost"
    />
  </Sidebar>
</template>

<style></style>
