<script>
import { getComments } from "@/http-client";
import Comment from "./Comment.vue";
import PostPreview from "./PostPreview.vue";
import Sidebar from "./Sidebar.vue";
import AddPost from "./AddPost.vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";

export default {
  name: "PostsList",
  components: {
    Sidebar,
    PostPreview,
    Comment,
    AddPost,
    InputField,
    TextAreaField,
  },
  props: {
    posts: Array,
  },
  data() {
    return {
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
  <div class="tile is-parent">
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

        <table class="table is-fullwidth is-striped is-hoverable is-narrow">
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
      </div>
    </div>
  </div>

  <Sidebar v-if="isSidebarOpen" :class="{ 'Sidebar--open': isSidebarOpen }">
    <PostPreview :post="this.currentPost" />
    <Comment v-for="comment of this.comments" :comment="comment" />
  </Sidebar>

  <AddPost v-if="this.isWritingPost">
    <InputField />
    <TextAreaField />
  </AddPost>
</template>
