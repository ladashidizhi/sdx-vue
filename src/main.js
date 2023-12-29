import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/index'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
// 引入事件池
import EventPool from './utils/event'
import Events from './utils/event_register'
import { SetRequestInter, SetResponseInter } from '@/api/request'

import { useUsersStore } from '@/store/user'
import { Message } from '@arco-design/web-vue';

// 注册事件触发器
const eventPool = new EventPool()
eventPool.registerEvent(Events)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
// 挂载事件池到原型链上
app.config.globalProperties.$event = eventPool
app.use(eventPool).use(pinia).use(ArcoVue, {
        componentPrefix: 'arco' // 用于改变使用组件时的前缀名称
})
const store = useUsersStore() // 用户store

router.beforeEach((to, from, next)=>{
    if(to.path !== '/login'){
        if(store.user){
            if(store.user.expiresAt > new Date().getTime()){
                next()
                return 
            }
        }
    }else{
        next()
        return
    }
    Message.error("请先登录")
    router.push("/login")
})
    
    // 设置每次请求时携带Token
SetRequestInter((config)=>{
    if(config.url !== "/auth/login"){
        if(store.user){
            if(store.user.expiresAt > new Date().getTime()){
                config.headers["x-token"] = store.user.token
                return config
            }
        }
    }
    return config
})
    
    // 设置请求响应时查询状态
SetResponseInter((response)=>{
    if(response.status !== 200){
        Message.error(`请求访问错误，状态码 ${response.status}, 错误消息: ${response.data.toString()}`)
        response.data = null
        return response.data
    }
    switch(response.code){
        case 4:
            Message.error("授权过期，请重新登录")
            router.push("/login")
            break
    }

    return response.data
})

app.use(router).mount('#content')
