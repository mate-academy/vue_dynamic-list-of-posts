import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import { useUserStore } from '@/stores/users'
import ListOfPostPage from '../pages/ListOfPostPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ListOfPostPage,
      meta: { auth: true }
    },
    {
      path: '/login',
      component: LoginPage,
      meta: { auth: false }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const user = useUserStore()
  if (!user.isUserAuthenticated && to.meta.auth) {
    next('/login')
    return
  }

  if (user.isUserAuthenticated && !to.meta.auth) {
    next()
    return
  }

  next()
})

export default router
