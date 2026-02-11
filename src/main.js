import { createApp } from 'vue'
import { createPinia } from 'pinia'
import FloatingVue from 'floating-vue'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import 'floating-vue/dist/style.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(FloatingVue)
app.mount('#app')
