import { Message } from '@arco-design/web-vue'
import { Request } from '../request'
// 创建网站
export async function postAddWebSite(data) {
  try {
    const request = await Request.post('/websites', {
      dnsAccountId: data.dnsAccountId, //证书 dns id
      lexiconName: data.lexiconName, //词库
      remark: data.remark, //默认
      ip: data.ip,
      group: data.group,
      hostId: data.hostId,
      alias: data.alias, //www,@,m
      domain: data.domain, //网站域名
      idx_d: data.idx_d, //描述
      idx_k: data.idx_k, //关键字
      idx_t: data.idx_t, //标题
      inner_d: data.inner_d, //内描述
      inner_k: data.inner_k, //内关键字
      inner_t: data.inner_t, //内标题
      org_name: data.org_name, //公司名称
      origin_domain: data.origin_domain, //克隆网站
      ssl: data.ssl, //HTTPS模式
      concurrent: 4, //默认为4
      // enable: true, //默认为true
      config: {
        ascii: data.ascii, //零宽字符
        contact: data.contact, //屏蔽联系方式 true 1 flase 0
        deep: data.deep, //克隆深度 最小值3
        ext: data.ext, //文件格式 html、php 等
        h1: data.h1, //替换文章标题
        rewrite: data.rewrite, //内容伪原创
        js_title: data.js_title, //默认为0
        tpl: data.tpl, //使用模板库 true 1 flase 0
        img_word: data.img_word, //图片文字
        steg: data.steg, //零宽字符
        face_code: data.face_code, //干扰码
        limit: data.limit, //模板限制
        ua: data.ua, //模板类型
        quality: data.quality, //图片质量 最小值 10
        brand: data.brand,
      },
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

// 通过 id 查询网站
export async function getWebSiteID(id) {
  const request = await Request.get(`/websites/${id}`)
  if (request.code === 7) {
    Message.error(request.msg)
  } else {
    return request
  }
}

// 修改网站
export async function postUpdateWebSite(data) {
  try {
    const request = await Request.post('/websites/update', {
      id: data.id,
      dnsAccountId: data.dnsAccountId, //证书 dns id
      lexiconName: data.lexiconName, //词库
      remark: data.remark, //默认
      ip: data.ip,
      group: data.group,
      hostId: data.host_id,
      concurrent: 4, //默认为4
      alias: data.alias, //www,@,m
      domain: data.domain, //网站域名
      idx_d: data.idx_d, //描述
      idx_k: data.idx_k, //关键字
      idx_t: data.idx_t, //标题
      inner_d: data.inner_d, //内描述
      inner_k: data.inner_k, //内关键字
      inner_t: data.inner_t, //内标题
      org_name: data.org_name, //公司名称
      origin_domain: data.origin_domain, //克隆网站
      ssl: data.ssl, //HTTPS模式
      zhc: 0, //默认
      config: {
        ascii: data.ascii, //零宽字符
        contact: data.contact, //屏蔽联系方式 true 1 flase 0
        deep: data.deep, //克隆深度 最小值3
        ext: data.ext, //文件格式 html、php 等
        h1: data.h1, //替换文章标题
        rewrite: data.rewrite, //内容伪原创
        js_title: data.js_title, //默认为0
        tpl: data.tpl, //使用模板库 true 1 flase 0
        img_word: data.img_word, //图片文字
        steg: data.steg, //零宽字符
        face_code: data.face_code, //干扰码
        limit: data.limit, //模板限制
        ua: data.ua, //模板类型
        quality: data.quality, //图片质量 最小值 10
        brand: data.brand,
      },
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

// 删除网站
export async function postDelWebSite(data) {
  const request = await Request.post('/websites/del', {
    websiteId: data.websiteId,
    forceDelete: data.forceDelete,
    domains: data.domains,
    description: data.description,
    delete_only_website:data.delete_only_website,
  })
  if (request.code === 7) {
    Message.error(request.msg)
  } else {
    Message.success(request.msg)
  }
  return request
}

// 获取网站列表
export async function getWebSite(data) {
  try {
    const request = await Request.get('/websites/list', {
      params: {
        hostId: data.hostId,
        pageSize: data.pageSize,
        page: data.page,
        tag: data.tag,
        domain: data.domain,
        category:data.category,
      },
    })
    if (request.code === 7) {
      throw request
    } else {
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

// 获取网站站点名称列表
export async function postWebSiteList(data) {
  try {
    const request = await Request.post('/websites/options', {
      hostId: data.hostId,
      category:data.category,
      page: data.page,
      pageSize: data.pageSize,
      info: data.info,
      group: data.group,
      include: data.include,
      rank: data.rank,
      rankSymbol: data.rankSymbol,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///验证IP是否在该节点上
export async function postWebSiteCheckIp(hostId, ip) {
  const request = await Request.post('/websites/checkIp', {
    hostId: hostId,
    ip: ip,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

///查询网站统计代码设置
export function GetStatistic(websiteId) {
  return Request.get(`/websites/${websiteId}/statisticCode`)
}

///更新网站统计代码设置
export async function postStatistic(data) {
  const request = await Request.post('/websites/statisticCode', {
    content: data.content,
    filePath: data.filePath,
    websiteId: data.websiteId,
    domains: data.domains,
    group: '统计',
  })
  if (request.code === 7) {
    return request
  } else {
    return request
  }
}
///清理缓存
export async function delDomainCache(domain) {
  const request = await Request.get(`/infinite_website/domains/delDomainCache`,{
    params:{
      domains:domain
    }
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///重新克隆网站
export async function reCloneWebsite(domain) {
  const request = await Request.get(`/infinite_website/domains/reClone`,{
    params:{
      domains:domain
    }
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}


///查询网站广告设置
export async function getAds(websiteId) {
  const request = await Request.get(`/websites/${websiteId}/ads`)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///更新网站广告设置
export async function postAds(data) {
  const request = await Request.post('/websites/ads', {
    content: data.content,
    filePath: data.filePath,
    websiteId: data.websiteId,
    domains: data.domains,
    group: '广告',
  })
  if (request.code === 7) {
    return request
  } else {
    return request
  }
}

///查询网站友链设置
export async function getFriend(websiteId) {
  const request = await Request.get(`/websites/${websiteId}/friendChain`)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

//更新网站友链设置
export async function postFriend(data) {
  const request = await Request.post('/websites/friendChain', {
    content: data.content,
    showPosition: data.showPosition,
    websiteId: data.websiteId,
    domains: data.domains,
    group: '友链',
  })
  if (request.code === 7) {
    return request
  } else {
    return request
  }
}

///查询网站友链设置
export async function getNginx(websiteId) {
  try {
    const request = await Request.get(`/websites/${websiteId}/config`)
    if (request.code === 7) {
      throw request
    } else {
      // Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

//更新网站友链设置
export async function postNginx(data) {
  try {
    const request = await Request.post('/websites/nginx/update', {
      content: data.content,
      websiteId: data.websiteId,
      group: '友链',
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///查询模板
export async function getSitePath(websiteId) {
  try {
    const request = await Request.get(`/websites/${websiteId}/sitePath`)
    if (request.code === 7) {
      throw request
    } else {
      // Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

//批量替换模板代码
export async function postSetter(data) {
  try {
    const request = await Request.post('/websites/template/setter', {
      website_ids: data.webSiteId,
      configs: data.configs,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

//批量修复Vhost
export async function postVhost(data) {
  const request = await Request.post('/websites/nginx/vhost', {
    domains: data.domains,
    websiteId: data.websiteId,
    webRule: data.webRule,
  })

  return request
}
//开启CF-CDN
export async function postCdn(data, group) {
  const request = await Request.post('/websites/cdn', {
    domains: data.domains,
    websiteId: data.websiteId,
    operator: data.operator,
    group: group,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
//开启CF-CDN
export async function closeCfCustom(data, group) {
  const request = await Request.post('/websites/closeCfCustom', {
    domains: data.domains,
    websiteId: data.websiteId,
    operator: data.operator,
    group: group,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
export async function editSSlType(data, group) {
  const request = await Request.post('/websites/cfSsl', {
    domains: data.domains,
    websiteId: data.websiteId,
    operator: data.operator,
    group: group,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

//开启CF-WAF
export async function postWaf(data, group) {
  const request = await Request.post('/websites/waf', {
    domains: data.domains,
    websiteId: data.websiteId,
    operator: data.operator,
    group: group,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

//开启缓存
export async function postCache(data) {
  const request = await Request.post('/websites/cfCacheLevel', {
    domains: '', //data.domains,
    websiteId: data.websiteId,
    operator: data.operator, //'off[关闭]/cache_everything[缓存所有内容]',
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///启用禁用站点
export async function postStatus(data) {
  const request = await Request.post('/websites/siteStatus', {
    websiteId: data.websiteId,
    status: data.status,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

///加速域名
export async function postSpeed(data) {
  const request = await Request.post('/websites/cfAccelerateDomain', {
    domains: data.domains,
    websiteId: data.websiteId,
    operator: data.operator,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///重试解析
export async function getDnsParse(id, domain, cf = false) {
  const request = await Request.get(`/websites/${id}/dnsParse/${domain}/${cf}`)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

///续签证书

export async function getSSLId(id) {
  const request = await Request.post('/websites/ssl/renew', {
    SSLId: id,
  })
  if (request.code === 7) {
    Message.error(request.msg)
  } else {
    Message.success(request.msg)
    return request
  }
}

///----导入域名

export async function cfZone(data) {
  const request = await Request.post('/websites/cfZone', {
    domain: [data.domains],
    dns: data.dns,
    proxy: data.proxy,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///--------专家模式 站点配置

///专家模式详情
export async function getExpertMode(data) {
  const request = await Request.get('/websites/expertMode', {
    params: data,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
///专家模式
export async function postExpertMode(data) {
  const request = await Request.post('/websites/expertMode', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
///模板内容查询

export async function getEexpertModeTmp(data) {
  const request = await Request.get('/websites/expertModeTmp', {
    params: data,
  })
  return request
}

export async function postEexpertModeTmp(data) {
  const request = await Request.post('/websites/expertModeTmp', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///一键同步
export async function postWgetDownloadTxt(id) {
  const request = await Request.post('websites/wgetDownloadTxt', {
    hostId: id,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

export async function putEexpertModeTmp(data) {
  const request = await Request.put('/websites/expertModeTmp', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

export async function delEexpertModeTmp(data) {
  const request = await Request.delete('/websites/expertModeTmp', {
    params: data,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

////提取页面A链接
export async function PostExtractLink(url, type) {
  const request = await Request.post('/tools/extractLink', {
    url: url,
    onlyLink: type,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

////重定向(CF)
export async function PostCfRedirect(data) {
  const request = await Request.post('/websites/cfRedirect', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

////重定向(CF)
export async function PostNginxRedirect(data) {
  const request = await Request.post('/infinite_website/redirect', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
