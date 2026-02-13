import { createRouter, createWebHistory } from 'vue-router'

const result = []
const summaryResult = []
const modules = import.meta.glob('./**/*.js', { eager: true })
for (let name in modules) {
  if (name === './summary/index.js') {
    summaryResult.push(...modules[name].default)
  }
  result.push(...modules[name].default)
}

const routes = [
  {
    path: '/',
    // 登录后的默认落地页（也作为根路径默认页）
    redirect: '/home/infinite',
    meta: {
      index: 0,
    },
  },
  {
    // ✅ 独立 Admin 首页（与原 /home 系统区分）
    path: '/admin',
    name: 'AdminIndex',
    component: () => import('@/views/admin/index.vue'),
    meta: {
      index: 2,
      role: 'admin',
    },
  },
  {
    path: '/admin/accounts',
    name: 'AdminAccounts',
    component: () => import('@/views/admin/accounts.vue'),
    meta: { index: 2, role: 'admin' },
  },
  {
    path: '/admin/servers',
    name: 'AdminServers',
    component: () => import('@/views/admin/servers.vue'),
    meta: { index: 2, role: 'admin' },
  },
  {
    path: '/admin/domains',
    name: 'AdminDomains',
    component: () => import('@/views/admin/domains.vue'),
    meta: { index: 2, role: 'admin' },
  },
  {
    path: '/admin/tj',
    name: 'AdminTj',
    component: () => import('@/views/admin/tj.vue'),
    meta: { index: 2, role: 'admin' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: {
      index: 1,
    },
  },
  {
    name: 'Home',
    path: '/home',
    component: () => import('@/views/home.vue'),
    children: [
      ...result,
      {
        path: '/home/analysis',
        name: 'Summary', //IP风险管理
        children: summaryResult,
        component: () => import('@/views/site_statisticians/index.vue'),
        meta: {
          cm: 3,
          pm: 6,
        },
      },
    ],
    meta: {
      index: 2,
      pm: 0,
    },
  },
  {
    name: 'Update',
    path: '/update',
    component: () => import('@/views/update.vue'),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
