import { reactive, computed } from 'vue';

export const store = reactive({
  users: [],
  currentUserId: 1,
  posts: [],
  postsLoading: false,
  postsError: '',
  selectedPostId: null,

  get currentUser() {
    return store.users.find(u => u.id === store.currentUserId) || null;
  },

  selectedPost: computed(() => {
    return store.posts.find(p => p.id === store.selectedPostId) || null;
  }),
});
