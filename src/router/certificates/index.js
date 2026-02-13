export default [
  {
    path: '/home/ssl',
    name: 'SSL',
    component: () => import('@/views/certificates_ssl/ssl/index.vue'),
    meta: {
      cm: 1,
      pm: 5,
    },
  },
  {
    path: '/home/dns',
    name: 'DNS',
    component: () => import('@/views/certificates_ssl/dns/index.vue'),
    meta: {
      cm: 2,
      pm: 5,
    },
  },
  {
    path: '/home/registrar',
    name: 'Registrar',
    component: () => import('@/views/certificates_ssl/registrar/index.vue'),
    meta: {
      cm: 3,
      pm: 5,
    },
  },
]
