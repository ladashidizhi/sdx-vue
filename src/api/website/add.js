import { Request } from '../request'

// GetDNSAccounts 获取DNS账户
// @param page - 页码
// @param pageSize - 数量
export function GetDNSAccounts(page = 1, pageSize = 100) {
  return Request.post('/websites/dns/search', {
    page,
    pageSize,
  })
}

// TestDomain 测试域名
// @param dnsAccountId - DNS账户ID
// @param domain - 域名
export function TestDomain(dnsAccountId, domain) {
  return Request.post('/websites/checkDomain', {
    dnsAccountId,
    domain,
  })
}

// TestDomain 测试IP
// @param hostId - 主机ID
// @param ip - IP
export function TestIP(hostId, ip) {
  return Request.post('/websites/checkIp', {
    hostId,
    ip,
  })
}

// UserTemplate 用户收藏模板
// @param info - 搜索字符串
// @param page - 页码
// @param pageSize - 数量
export function UserTemplate(info, page = 1, pageSize = 10) {
  return Request.post('/websites/userTemplate', {
    info,
    page,
    pageSize,
  })
}

// UserTemplate 查询词库列表
// @param info - 搜索字符串
// @param page - 页码
// @param pageSize - 数量
export function LexiconSearch(info, page = 1, pageSize = 10) {
  return Request.post('/websites/lexiconSearch', {
    info,
    page,
    pageSize,
  })
}

// AddWebSite 创建站点
/*
    {

    }
*/
export function AddWebSite(data) {
  return Request.post('/websites', data)
}

// UpdateWebSite 更新站点
/*
    {
    }
*/
export function UpdateWebSite(data) {
  return Request.post('/websites/update', data)
}

export function SysncsRule(webSite) {
  return Request.post('/render/statusEdit', {
    website_id: webSite,
  })
}

export function SysncsGetLimiter(host_id) {
  return Request.post('/render/globalGetRule', {
    host_id: host_id,
  })
}

export function SysncsPostLimiter(host_id, limiter) {
  return Request.post('/render/globalRule', {
    host_id: host_id,
    timeout: limiter.timeout,
    qps: limiter.qps,
    IsOpenLimiter: limiter.IsOpenLimiter,
  })
}

///更新图标
export function updateColor(id, color) {
  return Request.post('/websites/setColor', {
    id: id,
    color: color,
  })
}
