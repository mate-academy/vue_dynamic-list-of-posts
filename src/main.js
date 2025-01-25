import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'bulma';
import '@fortawesome/fontawesome-free/css/all.css';


import './assets/main.scss'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
