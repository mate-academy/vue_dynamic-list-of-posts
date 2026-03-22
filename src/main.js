import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importa os estilos do Bulma CSS e ícones do FontAwesome
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Cria a instância do app Vue, injeta as rotas e monta na div #app
const app = createApp(App);
app.use(router);
app.mount('#app');
