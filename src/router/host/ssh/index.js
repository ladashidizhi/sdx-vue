export default [
  {
    path: '/home/ssh',
    name: 'SSH',
    component: () => import('@/views/ssh/ssh.vue'),
    meta: {
      cm: 2,
      pm: 4,
    },
  },
]
