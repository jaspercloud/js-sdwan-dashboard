import './assets/normalize.css'
import './assets/flex.css'
import './assets/base.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
