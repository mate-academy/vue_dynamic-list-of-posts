import './assets/main.css'
import './assets/tailwind.css'
import 'bulma/bulma.scss'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
