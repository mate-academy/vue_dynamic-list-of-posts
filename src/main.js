import { createApp } from "vue";
import App from "./App.vue";

import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      inSidebar: "",
      postList: [],
      currentPost: null,
      userId: null,
    };
  },

  mutations: {
    addPostList(state, posts) {
      if (Array.isArray(posts)) {
        state.postList = [...posts];
      } else {
        state.postList.push(posts);
      }
    },

    updatePost(state, newPost) {
      const index = state.postList.findIndex((post) => post.id === newPost.id);

      if (index === -1) return;

      state.postList.splice(index, 1, newPost);
    },

    deletePost(state, postId) {
      const index = state.postList.findIndex((post) => post.id === postId);

      if (index === -1) return;

      state.postList.splice(index, 1);
    },

    setInSidebar(state, newStatus) {
      state.inSidebar = newStatus;
    },

    setCurrentPost(state, newPost) {
      state.currentPost = newPost;
    },

    setUserId(state, newUserId) {
      state.userId = newUserId;
    },
  },
});

createApp(App).use(store).mount("#app");
