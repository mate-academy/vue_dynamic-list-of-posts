import { createApp } from 'vue'
import App from './App.vue'
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { router } from '../routes';


createApp(App)
.use(router)
.use(autoAnimatePlugin)
.mount('#app');