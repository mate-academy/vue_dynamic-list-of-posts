import './assets/main.scss'
import 'bulma/bulma.scss'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import store from './stores/store'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
