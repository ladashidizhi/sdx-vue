import { Request } from '../request'
import { Message } from '@arco-design/web-vue'

// GetHostList 获取主机列表
export function GetHostList(info, page, pageSize = 200) {
  return Request.post('/hosts/search', {
    info,
    pageSize,
    page,
    isContainSelf: true,
  })
}
///查询主机信息
export function GetHost(hostId) {
  return Request.get(`/hosts/${hostId}`)
}

// HostCell 创建主机
export function PostAddHost(data) {
  return Request.post('/hosts', {
    addr: data.addr,
    authMode: 'password',
    description: '',
    name: data.name,
    passPhrase: '',
    password: window.btoa(data.password),
    port: Number(data.port),
    privateKey: '',
    rememberPassword: true,
    user: data.user,
  })
}

///Host 删除主机
export function PostDelHost(ids) {
  return Request.post('/hosts/del', {
    ids: ids,
  })
}

// HostCell 更新主机
export function updateHost(data) {
  return Request.post('/hosts/update', {
    id: data.id,
    addr: data.addr,
    authMode: 'password',
    description: '',
    name: data.name,
    passPhrase: '',
    password: window.btoa(data.password),
    port: Number(data.port),
    privateKey: '',
    rememberPassword: true,
    user: data.user,
  })
}
///报警配置
/// 获取报警配置（预警配置）
export function GetAlert(hostId) {
  return Request.get('/alert/config', {
    params: {
      hostId: hostId,
    },
  })
}

///修改报警配置（预警配置）
export function PostEditAlert(data) {
  return Request.post('/alert/configUpdate', {
    id: data.id,
    synthesize: parseInt(data.synthesize),
    cpu: parseInt(data.cpu),
    memory: parseInt(data.memory),
    disk: parseInt(data.disk),
    bandwidth: parseInt(data.bandwidth),
    interval: parseInt(data.interval),
  })
}

//
///默认页面 反审查 403 404
//查询默认页面server_id=1&website_id=1&antiType=3
export function GetAntiHTML(data) {
  return Request.get(`/websites/antiHTML/${data.antiType}`, {
    params: {
      website_id: data.website_id,
      server_id: data.server_id,
      global: data.global,
    },
  })
}

//修改 反审查 403 404
export function PostAntiHTML(data) {
  const glo = data.global == 1 ? true : false
  return Request.post(
    `/websites/antiHTML/${data.antiType}`,
    {
      content: data.content,
      global: glo,
      sync: data.sync,
    },
    {
      params: {
        website_id: data.website_id,
        server_id: data.server_id,
      },
    }
  )
}

/// 获取首页基础数据
export async function GetDashboardBase(hostId, net) {
  const request = await Request.get(
    `/hosts/dashboard/base/${hostId}/all/${net}`
  )
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

/// 获取首页实时数据
export async function GetDashboardCurrent(hostId, net) {
  const request = await Request.get(
    `/hosts/dashboard/current/${hostId}/all/${net}`
  )
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

/// 主机网卡
export async function GetNetoptions(hostId) {
  try {
    const request = await Request.get(`/hosts/monitors/netoptions/${hostId}`)
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

// UpgradeNginx 升级Nginx
export function UpgradeNginx(hostId) {
  return Request.post(`/software/upgrade`, {
    host_id: [hostId],
    choice: 4,
    version: '1.21.2',
  })
}

///启动服务
export function getReinstall(hostId, force = false) {
  try {
    const request = Request({
      url: `/hosts/reinstall`,
      method: force ? 'PUT' : 'GET',
      params: {
        host_id: hostId,
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


/// 获取报警配置（预警配置）
export function Reboot(hostId) {
  return Request.get('/nginx/rebootServer', {
    params: {
      hostId: hostId,
    },
  })
}


// HostCell 更新主机
export function ProxySection(data) {
  return Request.post('/user/proxy_section', {
    host_id: data.hostId,
    proxy_section: data.proxy_section,
  })
}

/// 获取报警配置（预警配置）
export function GetProxySection(hostId) {
  return Request.get('/user/proxy_section', {
    params: {
      host_id: hostId,
    },
  })
}

