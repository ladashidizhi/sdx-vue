import { Request } from '../request'

// 获取软件列表 2
export function GetAppList() {
  return Request.get('/software/update')
}

// GetMasterUpgradeState 获取群控升级状态
export function GetMasterUpgradeState() {
  return Request.get('/software/state')
}

// 获取当前版本0-节点 1-渲染 2-克隆 3-群控 4-NGINX 5-Redis 6-FluentBit 7-所有
export function getVersion(host_id, choice) {
  return Request.get('/software/version', {
    params: {
      host_id: host_id,
      choice: choice,
    },
  })
}

// 更新版本列表
export function getHistory(choice) {
  return Request.get('/software/history', {
    params: {
      choice: choice,
    },
  })
}
//版本升级
export function postUpgrade(data) {
  return Request.post('/software/upgrade', data)
}

//软件状态
export function getProcess(data) {
  return Request.get('/hosts/process', {
    params: {
      name: data.name,
      host_id: data.host_id,
      op: data.op,
    },
  })
}

//Nginx运行状态
export function getNginxRuntime(data) {
  return Request.get('/nginx/runtime', {
    params: {
      cmd: data.cmd,
      hostId: data.hostId,
    },
  })
}

//获取 Nginx 配置信息
export function getNginx(host_id) {
  return Request.get(`/nginx/${host_id}`)
}

//修改 Nginx 配置信息
export function getNginxUpdate(data) {
  return Request.post('/nginx/file', {
    backup: data.backup,
    content: data.content,
    filePath: data.filePath,
    hostId: data.hostId,
  })
}

//获取 Nginx Lua 文件
export function getNginxLua(host_id) {
  return Request.get(`/nginx/lua/${host_id}`)
}

//修改 Nginx Lua 文件
export function getNginxLuaUpdate(data) {
  return Request.post('/nginx/lua/file', {
    backup: data.backup,
    content: data.content,
    filePath: data.filePath,
    hostId: data.hostId,
  })
}
