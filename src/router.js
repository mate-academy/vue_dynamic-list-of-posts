import { createWebHashHistory, createRouter } from 'vue-router';

import Login from './components/Login.vue';
import HomeView from './components/HomeView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: Login },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
