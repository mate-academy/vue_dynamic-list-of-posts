import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import Header from './components/Header.vue';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);
app.use(router);
app.component('Header', Header);
app.mount('#app');
