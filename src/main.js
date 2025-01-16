import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// for auth
import axios from 'axios'
import { extractIdentifiers } from 'vue/compiler-sfc'

axios.defaults.baseURL = 'http://localhost:8080/api'
axios.defaults.withCredentials = true

const app = createApp(App)

app.use(router)
app.config.globalProperties.$http = axios
app.mount('#app')
extractIdentifiers