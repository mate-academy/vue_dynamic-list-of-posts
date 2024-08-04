import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import 'bulma/css/bulma.css'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
