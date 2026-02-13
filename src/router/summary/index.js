export default [
  {
    path: '/home/analysis/summary',
    name: 'Safetys',
    component: () => import('@/views/site_statisticians/web_summary/index.vue'),
    meta: {
      cm: 3,
      pm: 6,
      gm: '0',
    },
  },
  {
    path: '/home/analysis/site',
    name: 'SiteList',
    component: () => import('@/views/site_statisticians/site_list/index.vue'),

    meta: {
      cm: 3,
      pm: 6,
      gm: '6',
    },
  },
  {
    path: '/home/analysis/tendencies',
    name: 'Tendencies',
    component: () =>
      import('@/views/site_statisticians/flow_analysis/tendencies.vue'),
    meta: {
      cm: 3,
      pm: 6,
      gm: '1_1',
    },
  },
  {
    path: '/home/analysis/interviewed_view',
    name: 'InterviewedView',
    component: () =>
      import('@/views/site_statisticians/access_analysis/interviewed_view.vue'),
    meta: {
      cm: 3,
      pm: 6,
      gm: '3_0',
    },
  },
  {
    path: '/home/analysis/portalview',
    name: 'Portalview',
    component: () =>
      import('@/views/site_statisticians/access_analysis/portalview.vue'),
    meta: {
      cm: 3,
      pm: 6,
      gm: '3_1',
    },
  },
  {
    path: '/home/analysis/new_old_visitors',
    name: 'NewOldVisitors',
    component: () =>
      import('@/views/site_statisticians/access_analysis/new_old_visitors.vue'),
    meta: {
      cm: 3,
      pm: 6,
      gm: '3_2',
    },
  },
  {
    path: '/home/analysis/regional_view',
    name: 'RegionalView',
    component: () =>
      import('@/views/site_statisticians/access_analysis/regional_view.vue'),
    meta: {
      cm: 3,
      pm: 6,
      gm: '3_3',
    },
  },
  {
    path: '/home/analysis/all_source',
    name: 'AllSource',
    component: () =>
      import('@/views/site_statisticians/source_analysis/all_source.vue'),
    meta: {
      cm: 3,
      pm: 6,
      gm: '2_0',
    },
  },
  {
    path: '/home/analysis/search_term',
    name: 'SearchTerm',
    component: () =>
      import('@/views/site_statisticians/source_analysis/search_term.vue'),
    meta: {
      cm: 3,
      pm: 6,
      gm: '2_1',
    },
  },
]
