import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import LoginPage from "@/views/LoginPage.vue";

const routes = [
    { path: '/home', name: 'home', component: Home },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/', name: 'login', component: LoginPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
