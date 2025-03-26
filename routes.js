import LoginPage from "@/pages/LoginPage.vue";
import { createWebHistory } from "vue-router";
import { createRouter } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Dashboard",
      path: "/dashboard",
      component: () => import("@/pages/HomePage.vue"),
      meta: {
        isAuth: true,
      },
    },
    {
      name: "Base",
      path: "/",
      component: () => import("@/pages/HomePage.vue"),
      meta: {
        isAuth: true,
      },
    },
    {
      name: "Login",
      path: "/login",
      component: LoginPage,
      meta: {
        isAuth: false,
      },
    }
  ],
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.isAuth)) {
    const  user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});
