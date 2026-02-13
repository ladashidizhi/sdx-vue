export default [
  {
    path: '/home/infinite',
    name: 'Infinite',
    component: () => import('@/views/infinite/index.vue'),
    meta: {
      cm: 1, //子集菜单 对应的顺序 和 路由的sort相关一一对应的
      pm: 3, //侧边菜单 对应的顺序 和 路由的sort相关一一对应的
    },
  },
  {
    path: '/home/infinite/clone_configure',
    name: 'InfiniteCloneConfigure', //克隆
    component: () => import('@/views/clone_configure_infinite/index.vue'),
    meta: {
      cm: 2, // 对应克隆侠下第2个子菜单
      pm: 3, // 对应"克隆侠"的 Sort: 3
    },
  },
  {
    path: '/home/batch/:id',
    name: 'Batch', //批量
    component: () => import('@/views/batch/index.vue'),
    meta: {
      cm: 3,
      pm: 3,
    },
  },
  {
    path: '/home/cloneParasite',
    name: 'CloneParasite', //全局源站模板
    component: () => import('@/views/batch/parasite.vue'),
    meta: {
      cm: 4,
      pm: 3,
    },
  },
]
