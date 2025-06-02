import { createRouter, createWebHistory } from 'vue-router';
import PostDetails from '../views/PostDetails.vue';
import Login from '../views/Login.vue';
import PostsView from '../views/PostsView.vue';

const routes = [
  { path: '/', name: 'Posts', component: PostsView },
  { path: '/post/:id', name: 'PostDetails', component: PostDetails },
  { path: '/login', name: 'Login', component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
