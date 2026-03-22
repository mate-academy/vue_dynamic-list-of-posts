import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import PostsView from '../views/PostsView.vue';

// Definição das rotas da aplicação
const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsView,
  },
];

// Criação do router utilizando navegação baseada em Hash
// para facilitar o reload da página em servidores estáticos
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
