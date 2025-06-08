import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

createApp(App).use(store).mount('#app');
