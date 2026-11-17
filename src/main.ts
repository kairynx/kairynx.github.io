import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

// Element Plus 组件与样式由 unplugin-vue-components 按需自动注入，
// 所以这里不需要再 import ElementPlus / element-plus/dist/index.css
createApp(App).use(router).mount('#app')
