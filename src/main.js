import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from './axiosConfig'

const app = createApp(App)

app.config.globalProperties.$http = axios

app.use(router)
app.mount('#app')
