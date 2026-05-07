import { createApp } from 'vue'
import VueDragResizeRotate from '../index'
import App from './App.vue'

const app = createApp(App)
app.use(VueDragResizeRotate)
app.mount('#app')
