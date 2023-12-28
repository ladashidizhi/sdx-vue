import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/index'
import { createPinia } from "pinia"
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
// 引入事件池
import EventPool from './utils/event'
import Events from './utils/event_register'

const eventPool = new EventPool()
eventPool.registerEvent(Events)

const app = createApp(App)

// 挂载事件池到原型链上
app.config.globalProperties.$event = eventPool

app.use(eventPool)
    .use(ArcoVue, {
        componentPrefix: 'arco' // 用于改变使用组件时的前缀名称
    }).use(router)
    .mount('#content')
