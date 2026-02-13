import { Request } from '../request'
import { Message } from '@arco-design/web-vue'
// 查询ssl 证书
export async function postSearchSsl(data) {
  try {
    const request = await Request.post('/websites/ssl/search', {
      domain: data.domain,
      page: data.page,
      pageSize: data.pageSize,
    })
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

// 新增ssl 证书
export async function postAddSsl(domain, dnsAccountId) {
  const request = await Request.post('/websites/ssl/new', {
    domain,
    dnsAccountId,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

// 修改ssl 证书
export function postEditSsl(domain) {
  return Request.post('/websites/ssl/update', {
    domain,
  })
}

// 删除ssl 证书
export async function postDelSsl(id) {
  try {
    const request = await Request.post('/websites/ssl/del', {
      id,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

// 一键部署ssl 证书
export async function postDeploymentSsl(id) {
  const request = await Request.post('/websites/ssl/deployment', {
    id,
  })

  return request
}

///查询Dns列表
export async function postSearchDns() {
  try {
    const request = await Request.post('/websites/dns/search', {
      page: 1,
      pageSize: 600,
    })
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

///添加Dns
export async function postAddDns(data) {
  try {
    const request = await Request.post('/websites/dns', {
      name: data.name,
      type: data.type,
      isDefault: Boolean(Number(data.isDefault)),
      authorization: {
        APIkey: data.ApIkey,
        email: data.email,
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
    throw e
  }
}

///修改Dns
export async function postEditDns(data) {
  try {
    const request = await Request.post('/websites/dns/update', {
      id: data.id,
      name: data.name,
      type: data.type,
      isDefault: Boolean(Number(data.isDefault)),
      authorization: {
        APIkey: data.ApIkey,
        email: data.email,
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

///删除Dns
export async function postDelDns(id) {
  try {
    const request = await Request.post('/websites/dns/del', {
      id,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///注册商列表
export async function postSearchDomain() {
  try {
    const request = await Request.post('/websites/domain/search', {
      page: 1,
      pageSize: 500,
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

///添加注册商
export async function postAddDomain(data) {
  try {
    const request = await Request.post('/websites/domain', {
      name: data.name,
      register_type: data.register_type,
      app_id: data.app_id,
      app_key: data.app_key,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///编辑注册商
export async function postUpdateDomain(data) {
  try {
    const request = await Request.post('/websites/domain/update', {
      id: data.id,
      name: data.name,
      register_type: data.register_type,
      app_id: data.app_id,
      app_key: data.app_key,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///删除注册商
export async function postDelDomain(id) {
  try {
    const request = await Request.post('/websites/domain/del', {
      id,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///转移站点
export async function postTransferSite(data) {
  try {
    const request = await Request.post('/websites/transferHost', {
      domains: data.domains,
      hostId: data.hostId,
      dnsId: data.dnsId,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
