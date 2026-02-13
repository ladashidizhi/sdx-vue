export default [
  {
    path: '/home/cdn/website',
    name: 'WebsiteCnd',
    component: () => import('@/views/steel_cdn/website_manage/index.vue'),
    meta: {
      cm: 1,
      pm: 2,
    },
  },
  {
    path: '/home/cdn/node',
    name: 'NodeCnd',
    component: () => import('@/views/steel_cdn/node_manage/index.vue'),
    meta: {
      cm: 2,
      pm: 2,
    },
  },
  // {
  //   path: '/home/cdn/system',
  //   name: 'SystemCnd',
  //   component: () => import('@/views//cnd/index.vue'),
  //   meta: {
  //     cm: 3,
  //     pm: 3,
  //   },
  // },
]
