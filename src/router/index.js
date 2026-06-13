import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import PostsView from '../views/PostsView.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
