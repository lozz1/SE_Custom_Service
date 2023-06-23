import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import ElementPlus from "element-plus"
import store from './store'
import 'element-plus/theme-chalk/index.css';

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(router)
app.use(store)
app.mount('#app')
