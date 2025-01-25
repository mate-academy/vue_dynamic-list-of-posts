import { createPost, deletePost, getPosts, updatePost } from "@/api/posts";
import { defineStore } from "pinia";

export const usePostStore = defineStore("post", {
  state: () => ({
    posts: [],
    currentPost: null,
    isLoadingPost: false,
    isShowDetailsPost: false,
    isShowPostForm: false,
    isUpdatingPost: false,
  }),
  actions: {
    updatingPost() {
      this.isUpdatingPost = true;
    },
    notUpdatingPost() {
      this.isUpdatingPost = false;
    },
    showPostForm() {
      this.isShowPostForm = true;
    },
    notShowPostForm() {
      this.isShowPostForm = false;
    },
    showDetailsPost() {
      this.isShowDetailsPost = true;
    },
    notShowDetailsPost() {
      this.isShowDetailsPost = false;
    },
    setPosts(posts) {
      this.posts = posts;
    },
    addPost(post) {
      this.posts.push(post);
    },
    setCurrentPost(post) {
      this.currentPost = post;
    },
    async fetchPosts(userId) {
      this.isLoadingPost = true;
      const { data } = await getPosts(userId);
      this.posts = data;
      this.isLoadingPost = false;
    },
    async createNewPost(newPost) {
      try {
        const response = await createPost(newPost);
        this.addPost(response.data);
      } catch (error) {
        console.error("Error adding post:", error);
        throw new Error("Failed to add post. Please try again");
      }
    },
    async removePost(postId) {
      const index = this.posts.findIndex(
        (post) => post.id === postId
      );

      const [deletedPost] = this.posts.splice(index, 1);

      try {
        await deletePost(postId);
        this.currentPost = null;
        this.notShowDetailsPost();
      } catch (error) {
        console.error("Failed to delete post on server:", error);
        this.posts.splice(index, 0, deletedPost);
      }
    },
    async updatePost(postId, updatedPost) {
      const index = this.posts.findIndex(post => post.id === postId);
      const originalPost = { ...this.posts[index] };
      this.posts[index] = { ...this.posts[index], ...updatedPost };

      try {
        const response = await updatePost(postId, updatedPost);
        this.posts[index] = { ...response.data };
      } catch (error) {
        console.error('Failed to update post:', error);
        this.posts[index] = originalPost;
        throw new Error('Failed to update post. Please try again')
      }
    }
  },
});
