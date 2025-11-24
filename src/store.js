import { reactive } from 'vue';

export const store = reactive({
  user: null,
  posts: [],
  selectedPost: null,
  isSidebarOpen: false,
  comments: [],
  arePostsLoading: false,
  postsError: null,
  areCommentsLoading: false,
  commentsError: null,
});
