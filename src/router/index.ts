import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Main from '../views/Main.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/register/:email',
    name: 'register',
    component: Register,
    props: true,
  },
  {
    path: '/main/:id',
    name: 'main-page',
    component: Main,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userId = localStorage.getItem('userId')
  const isAuth = !!userId

  if (to.meta.requiresAuth && !isAuth) {
    next('/')
    return
  }

  if (isAuth && (to.path === '/' || to.path.startsWith('/register'))) {
    next(`/main/${userId}`)
    return
  }

  next()
})

export default router
