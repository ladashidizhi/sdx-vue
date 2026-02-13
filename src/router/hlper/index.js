export default [
  {
    path: '/home/helper',
    name: 'siteHelper',
    component: () => import('@/views/site_helper/index.vue'),
    meta: {
      cm: 1,
      pm: 7,
    },
  },
]
