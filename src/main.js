import { createApp } from 'vue'
import App from './components/App.vue'
import router from './router';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css'

createApp(App)
  .use(router)
  .mount('#app');