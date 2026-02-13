import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/index'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import ArcoVue from '@arco-design/web-vue'
import './styles/theme.css'
import './styles/autofill-fix.css'
// 引入事件池
import EventPool from './utils/event'
import Events from './utils/event_register'
import { SetRequestInter, SetResponseInter } from '@/api/request'
import { useUsersStore } from '@/store/user'
import { Message } from '@arco-design/web-vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Icon } from '@arco-design/web-vue'

const IconFont = Icon.addFromIconFontCn({
  src:
    import.meta.env.MODE === 'development'
      ? '/public/iconfont.js'
      : `/iconfont.js?version=${import.meta.env.VITE_APP_VERSION}`,
})

// 注册事件触发器
const eventPool = new EventPool()
eventPool.registerEvent(Events)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
// 挂载事件池到原型链上
app.config.globalProperties.$event = eventPool
// 注入版本号
app.config.globalProperties.$version = import.meta.env.VITE_APP_VERSION
window.document.title += import.meta.env.VITE_APP_VERSION
  ? ' - v' + import.meta.env.VITE_APP_VERSION
  : ''

app
  .use(eventPool)
  .use(pinia)
  .use(IconFont)
  .use(ArcoVue, {
    componentPrefix: 'arco', // 用于改变使用组件时的前缀名称
  })
  .use(ArcoVueIcon)
const store = useUsersStore() // 用户store

router.beforeEach((to, from, next) => {
  NProgress.start()

  // admin 账号分流：独立后台 /admin（与 /home 系统区分）
  const adminUsers = ['admin', 'lds-admin', 'ok-admin', 'niu-admin']
  const loginName = String(
    store.user?.username || store.user?.userName || store.user?.name || ''
  ).toLowerCase()
  const isAdmin = adminUsers.includes(loginName)
  if (to.path !== '/login' && to.path !== '/update') {
    if (store.user) {
      // ✅ admin 默认落地页：隐藏原 /home 系统（任何 /home/* 都直接重定向到 /admin）
      // 这样 admin 登录后不会再看到原来的 /home 菜单与页面。
      if (isAdmin && (to.path === '/' || to.path.startsWith('/home'))) {
        next('/admin')
        return
      }

      // ✅ admin 访问 /admin 系列页面：直接放行，不走 pathList 权限菜单校验
      if (isAdmin && to.path.startsWith('/admin')) {
        next()
        return
      }

      // ❌ 非 admin 禁止访问 /admin
      if (!isAdmin && to.path.startsWith('/admin')) {
        Message.warning('您没有权限访问该页面')
        next('/home/infinite')
        return
      }

      if (store.pathList.length > 0) {
        let type = false
        store.pathList.forEach((e) => {
          if (e === to.path) {
            type = true
          }
          // 支持子路由匹配：如果访问的路径以菜单路径开头，也允许访问
          // 例如：菜单路径是 /home/tongji，访问 /home/tongji/statistics 也应该允许
          else if (e && to.path.startsWith(e + '/')) {
            type = true
          }
        })

        if (to.path === '/home') {
          type = true
        }

        if (!type) {
          ///网站概况
          const list = to.path.split('/')
          list.forEach((e) => {
            if (e === 'analysis') {
              type = true
            }
          })
        }
        if (type) {
          next()
          return
        } else {
          Message.warning('您没有权限访问！！！')
          router.push('/home')
        }
      }

      if (store.user.expiresAt > new Date().getTime()) {
        next()
        return
      }
    }
  } else {
    next()
    return
  }
  Message.error('请先登录')
  next('/login')
})

router.afterEach(() => {
  NProgress.done()
})

// 设置每次请求时携带Token
SetRequestInter((config) => {
  if (config.url !== '/auth/login') {
    if (store.user) {
      if (store.user.expiresAt > new Date().getTime()) {
        config.headers['x-token'] = store.user.token
        return config
      }
    }
  }
  return config
})

// 设置请求响应时查询状态
SetResponseInter((response) => {
  if (response.status !== 200) {
    Message.error(
      `请求访问错误，状态码 ${
        response.status
      }, 错误消息: ${response.data.toString()}`
    )
    response.data = null
    return response.data
  }
  switch (response.data.code) {
    case 8:
      if (response.config.url !== '/software/state') {
        Message.warning('当前正在升级，请勿操作...')
        router.push('/update')
        return null
      }
    case 4:
      Message.error('授权过期，请重新登录')
      router.push('/login')
      break
  }

  return response.data
})

Date.prototype.format = function (format) {
  var args = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var i in args) {
    var n = args[i]
    if (new RegExp('(' + i + ')').test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length)
      )
  }
  return format
}

app.use(router).mount('#content')
