import { defineStore } from 'pinia';
import { getUserPosts, updatePost, deletePost, addNewPost } from '../api/posts';
import { useUserStore } from './userStore';

export const usePostStore = defineStore('post', {
  state: () => ({
    postsList: [],
    isPostsListLoading: false,
    errorMessages: {
      fetch: null,
      title: null,
      body: null,
    },
    editingPost: null,
    newPost: {
      title: '',
      body: '',
    },
    isAddPostBtnActive: false,
    isCommentDetailsActive: null,
  }),

  actions: {
    async loadPosts() {
      const userStore = useUserStore();
      const userId = userStore.user.id;
      this.isPostsListLoading = true;
      this.errorMessages.fetch = null;
      try {
        this.postsList = await getUserPosts(userId);
      } catch (err) {
        this.errorMessages.fetch = 'Error fetching posts: ' + err.message;
      } finally {
        this.isPostsListLoading = false;
      }
    },

    async savePost(isNew = true) {
      const userStore = useUserStore();
      const userId = userStore.user.id;
      this.errorMessages.fetch = null;

      let postData;
      let result;

      try {
        if (isNew) {
          postData = {
            userId,
            title: this.newPost.title,
            body: this.newPost.body,
          };
          result = await addNewPost(postData);
          this.postsList.push(result);
          this.newPost = { title: '', body: '' };
          this.isAddPostBtnActive = false;
          this.isCommentDetailsActive = result;
        } else {
          if (!this.editingPost) return;
          postData = {
            title: this.editingPost.title,
            body: this.editingPost.body,
          };
          await updatePost(this.editingPost.id, postData);
          const index = this.postsList.findIndex(
            p => p.id === this.editingPost.id
          );
          if (index !== -1) {
            this.postsList[index] = { ...this.postsList[index], ...postData };
          }
          this.editingPost = null;
        }

        return result || true;
      } catch (err) {
        this.errorMessages.fetch = `Error ${isNew ? 'adding' : 'updating'} post: ${err.message}`;
        throw err;
      }
    },

    async deletePostById(id) {
      this.errorMessages.fetch = null;
      try {
        await deletePost(id);
        this.postsList = this.postsList.filter(post => post.id !== id);
        this.isCommentDetailsActive = null;
      } catch (err) {
        this.errorMessages.fetch = 'Error deleting post: ' + err.message;
      }
    },

    toggleAddPostBtn() {
      this.isCommentDetailsActive = null;
      this.isAddPostBtnActive = !this.isAddPostBtnActive;
    },
    async toggleOpenPostBtn(post, commentStore) {
      this.isAddPostBtnActive = false;
      if (
        this.isCommentDetailsActive &&
        this.isCommentDetailsActive.id === post.id
      ) {
        this.isCommentDetailsActive = null;
        commentStore.commentsList = [];
      } else {
        this.isCommentDetailsActive = { ...post };
        await commentStore.loadComments(post.id);
      }
    },
  },
});
