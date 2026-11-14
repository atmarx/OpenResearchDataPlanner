import { createApp } from 'vue'
import { createPinia } from 'pinia'
import FloatingVue from 'floating-vue'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import 'floating-vue/dist/style.css'

// A tab opened before a deploy still points at the old hashed chunks, which
// the server no longer has. When a lazy route or calculator fails to load,
// reload once to pick up the new index.html. Session state lives in
// localStorage, so nothing is lost. The timestamp guard stops a reload loop
// if the chunk is missing for some other reason.
const RELOAD_KEY = 'odp-chunk-reload-at'
function reloadForStaleChunk(event) {
  const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0)
  if (Date.now() - last < 10_000) return
  sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  event?.preventDefault?.()
  window.location.reload()
}
window.addEventListener('vite:preloadError', reloadForStaleChunk)
router.onError((err) => {
  if (/dynamically imported module|Importing a module script failed|error loading dynamically/i.test(err?.message || '')) {
    reloadForStaleChunk()
  }
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(FloatingVue)
app.mount('#app')
