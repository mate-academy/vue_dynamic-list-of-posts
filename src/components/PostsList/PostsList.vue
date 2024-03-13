<script>
import AddPost from "../AddPost/AddPost";
import PostComments from "../PostComments/PostComments";
import EditPost from "../EditPost/EditPost";
import PostLoader from '../Loader/PostLoader';
import { getPosts, createPost, removePost, updatePost } from "../../api/Posts";
import { getComment, createComment, removeComment } from "../../api/Comments";

export default {
  components: {
    AddPost,
    PostComments,
    EditPost,
    PostLoader,
  },

  data() {
    return {
      isAddPost: false,
      isOpenedPost: false,
      isEditedPost: false,
      isLoading: false,
      currentPostId: 0,
      posts: [],
      comments: [],
    };
  },

  props: {
    userId: Array,
  },

  mounted() {
    this.fetchPosts();
  },

  methods: {
    async fetchPosts() {
      try {
        this.isLoading = true;
        const { data } = await getPosts(this.userId[0]);
        this.posts = data;
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async handleSubmitPost({ title, body }) {
      try {
        const { data } = await createPost(title, body);
        this.posts.push(data);
        this.isAddPost = false;
      } catch (error) {
        throw new Error("Error adding post: " + error.message);
      }
    },

    async getCommentById(postId) {
      try {
        const { data } = await getComment(postId);
        this.currentComment = data;

        return this.currentComment;
      } catch {
        throw new Error("error fetchin comment");
      }
    },

    async handleUpdatePost(updatedPost) {
      const { title, body, postId } = updatedPost;

      try {
        this.isLoading = true;
        const { data } = await updatePost(title, body, postId);
        this.posts = this.posts.map((post) => {
          if (post.id === postId) {
            return data;
          }
          return post;
        });
        this.isEditedPost = false;
        this.isOpenedPost = true;
      } catch {
        throw new Error("error update post");
      } finally {
        this.isLoading = false;
      }
    },

    async handleRemovePost(postId) {
      try {
        this.isLoading = true;
        const { data } = await removePost(postId);
        console.log("Comment added successfully:", data);
        this.isOpenedPost = false;

        this.posts = this.posts.filter((post) => post.id !== postId);
      } catch (error) {
        throw new Error("Error removing post: " + error.message);
      } finally {
        this.isLoading = false;
      }
    },

    async handleAddComment(newComment) {
      try {
        const { data } = await createComment(newComment);
        this.comments.push(data);

        console.log("Comment added successfully:", data);
      } catch (error) {
        console.error("Error adding comment:", error);
        throw new Error("Error adding comment: " + error.message);
      }
    },

    async handleRemoveComment(id) {
      try {
        await removeComment(id);
        this.comments = this.comments.filter((comment) => comment.id !== id);
        console.log("Comment removed successfully:", id);
      } catch (error) {
        throw new Error("Error removing comment: " + error.message);
      }
    },

    handleChangeAddStatus() {
      this.isAddPost = !this.isAddPost;
      this.currentPostId = 0;
      if (this.isAddPost === true) {
        this.isOpenedPost = false;
      }
    },

    handleChangeOpenPostStatus() {
      this.isOpenedPost = !this.isOpenedPost;
      if (this.isOpenedPost === true) {
        this.isAddPost = false;
      }
    },

    currentOpenedPost() {
      return this.posts.find((post) => post.id === this.currentPostId);
    },

    currentOpenedComment() {
      return this.currentComment.filter(
        (comment) => comment.postId === this.currentPostId
      );
    },

    async handleOpenPost(postId) {
      if (this.currentPostId !== postId) {
        this.currentPostId = postId;
        this.currentComment = await this.getCommentById(postId);
        this.comments = this.currentOpenedComment();
        this.isOpenedPost = true;
        this.isAddPost = false;
      } else {
        this.currentPostId = null;
        this.isOpenedPost = false;
      }
    },

    handleEditPost() {
      this.isEditedPost = !this.isEditedPost;
      if (this.isEditedPost === true) {
        this.isAddPost = false;
        this.isOpenedPost = false;
      }
    },
  },

  provide() {
    return {
      removeComment: this.handleRemoveComment,
    };
  },
};
</script>

<template>

  <div className="tile is-parent">
    <div className="tile is-child box is-success">
      <div className="block">
        <div className="block is-flex is-justify-content-space-between">
          <p className="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            :class="{ 'is-light': isAddPost }"
            @click="handleChangeAddStatus"
          >
            Add New Post
          </button>
        </div>

        <PostLoader v-if="isLoading"/>

        <table v-else className="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr className="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th className="has-text-right">Actions</th>
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
                  :class="{ 'is-light': this.currentPostId !== post.id }"
                  @click="handleOpenPost(post.id)"
                >
                  {{ this.currentPostId !== post.id ? "Open" : "Close" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      class="tile is-parent is-8-desktop Sidebar"
      :class="{ 'Sidebar--open': isAddPost || isOpenedPost || isEditedPost }"
    >
      <AddPost
        @handleSubmit="handleSubmitPost"
        @handleChangeAddStatus="handleChangeAddStatus()"
        v-if="isAddPost"
      />

      <EditPost
        v-if="isEditedPost"
        :post="currentOpenedPost()"
        @updatePost="handleUpdatePost"
      />

      <PostComments
        :post="currentOpenedPost()"
        :comments="comments"
        v-if="isOpenedPost"
        @editPost="handleEditPost"
        @handleAddComment="handleAddComment"
        @handleRemovePost="handleRemovePost"
        @handleRemoveComment="handleRemoveComment"
      />
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;

  @media (min-width: 769px) {
    max-width: 0;
  }
}

.Sidebar--open {
  opacity: 1;

  @media (min-width: 769px) {
    max-width: 50%;
  }
}
</style>
