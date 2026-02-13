export default [
  {
    path: '/home/extract',
    name: 'Extract', //首页
    component: () => import('@/views/extract/index.vue'),
    meta: {
      pm: 1,
      cm: 1,
    },
  },
  {
    path: '/home/site',
    name: 'Site', //站点
    component: () => import('@/views/web_site/index.vue'),
    meta: {
      cm: 2,
      pm: 1,
    },
  },
  {
    path: '/home/effect_analyse',
    name: 'EffectAnalyse', //效果分析
    component: () => import('@/views/effect_analyse/index.vue'),
    meta: {
      cm: 3,
      pm: 1,
    },
  },

  {
    path: '/home/batch1/:id',
    name: 'Batch1', //批量
    component: () => import('@/views/batch/index.vue'),
    meta: {
      cm: 4,
      pm: 1,
    },
  },
  {
    path: '/home/clone_configure',
    name: 'CloneConfigure', //全局克隆配置
    component: () => import('@/views/clone_configure/index.vue'),
    meta: {
      cm: 5, // 对应闪电侠下第5个子菜单
      pm: 1, // 对应"闪电侠"的 Sort: 1
    },
  },
  {
    path: '/home/seo_protection',
    name: 'SeoProtection', //SEO防护
    component: () => import('@/views/seo_protection/index.vue'),
    meta: {
      cm: 1, // 对应"站长统计"下第1个子菜单（Sort: 1）
      pm: 6, // 对应"站长统计"的 Sort: 6
    },
  },
  {
    path: '/home/seo_protection/spider_type',
    name: 'SpiderType', //蜘蛛类型管理
    component: () => import('@/views/seo_protection/spider_type.vue'),
    meta: {
      cm: 2, // 对应"站长统计"下第2个子菜单（Sort: 2）
      pm: 6, // 对应"站长统计"的 Sort: 6
    },
  },
  {
    path: '/home/tongji',
    name: 'AccessLogIndex', //流量概况父页面
    component: () => import('@/views/access_log/index.vue'),
    redirect: '/home/tongji/statistics',
    meta: {
      cm: 3, // 对应"站长统计"下第3个子菜单（Sort: 3）
      pm: 6, // 对应"站长统计"的 Sort: 6
    },
    children: [
      {
        path: 'statistics',
        name: 'AccessLogStatistics', //流量概况
        component: () => import('@/views/access_log/statistics.vue'),
        meta: {
          cm: 3, // 继承父路由的 cm 值
          pm: 6,
          gm: 'statistics',
        },
      },
      {
        path: 'spider_records',
        name: 'SpiderRecords', //蜘蛛抓取记录
        component: () => import('@/views/access_log/spider_records.vue'),
        meta: {
          cm: 4, // 对应"站长统计"下第4个子菜单（Sort: 4，这是"蜘蛛记录"的直接菜单项）
          pm: 6,
          gm: 'spider_records',
        },
      },
    ],
  },
]
