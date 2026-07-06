import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { i18n, setLocale } from './i18n'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
setLocale(i18n.global.locale.value)
app.mount('#app')
