import { createApp } from 'vue'
import App from './App.vue';
import router from './router/index.js';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/custom.css';
import './assets/index.css';



const app = createApp(App)
app.use(router)
app.mount('#app')

