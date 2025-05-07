import { createRouter, createWebHistory } from 'vue-router';
import GetYourUserId from './components/GetYourUserId.vue';
import NeedToRegister from './components/needToRegister.vue';
import Header from './components/Header.vue';


const routes = [
  {
    path: '/',
    name: "GetYourUserId",
    component: GetYourUserId,
  },
  {
    path: '/needToRegister',
    name: "NeedToRegister",
    component: NeedToRegister,
  },
  {
    path: '/header',
    component: Header,
    name: 'Header',
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
