import { createWebHistory, createRouter } from 'vue-router'

import PostsList from '../components/PostsList.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';

const routes = [
  { path: '/', component: PostsList },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userData = JSON.parse(localStorage.getItem('userData'));

  if ((to.path !== '/login' && to.path !== '/register') && !userData) {
    next('/login');
  }
  else if ((to.path === '/login' || to.path === '/register') && userData && userData.id) {
    next('/');
  }
  else {
    next();
  }
});

export default router;