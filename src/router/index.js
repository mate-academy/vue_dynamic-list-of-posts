import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import { getLocalUser } from '@/helpers/getLocalUser';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
      meta: {
        needsAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.needsAuth) {
    const user = getLocalUser();
    if (user.id) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router
