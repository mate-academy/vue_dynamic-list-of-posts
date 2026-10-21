import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes
})

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
 
}

router.beforeEach((to, from) => {
  const needsAuth = to.matched.some(record => record.meta.requiresAuth)
  const userIsLoggedIn = isAuthenticated()

  if (needsAuth && !userIsLoggedIn) {
    return {name: 'login', query: {redirect: to.fullPath}}
  } else if (to.name === 'login' && userIsLoggedIn) {
    return {name: 'home'}
  } 
})

export default router;