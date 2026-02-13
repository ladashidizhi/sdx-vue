export default [
  {
    path: '/home/safety',
    name: 'Safety',
    component: () => import('@/views/safety/index.vue'),
    meta: {
      cm: 1,
      pm: 6,
    },
  },
  {
    path: '/home/ip_risk',
    name: 'IpRisk', //IP风险管理
    component: () => import('@/views/personal_centre/ip_risk/index.vue'),
    meta: {
      cm: 2,
      pm: 6,
    },
  },
]
