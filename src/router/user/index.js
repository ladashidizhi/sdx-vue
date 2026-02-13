export default [
  {
    path: '/home/user/personal',
    name: 'Personal', //个人中心
    component: () => import('@/views/personal_centre/personal/index.vue'),
    meta: {
      cm: 1,
      pm: 8,
    },
  },
  {
    path: '/home/user/batchSuper',
    name: 'BatchSupers', //服务器管理
    component: () => import('@/views/super/index.vue'),
    meta: {
      cm: 2,
      pm: 8,
    },
  },

  {
    path: '/home/user/site',
    name: 'UserSite', //站点管理
    component: () => import('@/views/personal_centre/site/index.vue'),
    meta: {
      cm: 3,
      pm: 8,
    },
  },
  {
    path: '/home/user/employee',
    name: 'Employee', //员工管理
    component: () => import('@/views/personal_centre/employee/index.vue'),
    meta: {
      cm: 4,
      pm: 8,
    },
  },
  {
    path: '/home/user/data',
    name: 'Data', //系统配置
    component: () => import('@/views/personal_centre/data/index.vue'),
    meta: {
      cm: 5,
      pm: 8,
    },
  },
]
