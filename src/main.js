import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'bulma/css/bulma.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

import App from './App.vue'

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
