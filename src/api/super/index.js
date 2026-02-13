import { Request } from '../request'
import { Message } from '@arco-design/web-vue'

export async function GetHostsList(page) {
  try {
    const request = await Request.post('/admin/host/lists', {
      page: page.page,
      pageSize: page.pageSize,
      host_id: page.host_id,
      user_id: Number(page.user_id),
      key_name: page.key_name,
      host_type: Number(page.host_type),
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

export async function PostHosts(data) {
  try {
    const request = await Request.post('/hosts', {
      addr: data.addr,
      business_ips: data.business_ips,
      host_type: JSON.stringify(data.host_type),
      name: data.name,
      password: btoa(data.password),
      port: Number(data.port),
      user: data.user,
      authMode: data.authMode,
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
export async function PostEditHosts(data) {
  try {
    const request = await Request.post('/hosts/update', {
      id: data.id,
      addr: data.addr,
      business_ips: data.business_ips,
      host_type: JSON.stringify(data.host_type),
      name: data.name,
      password: btoa(data.password),
      port: Number(data.port),
      user: data.user,
      authMode: data.authMode,
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

export async function PostDelHosts(ids) {
  try {
    const request = await Request.post('/hosts/del', {
      ids: ids,
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
export async function Transfer(data) {
  try {
    const request = await Request.post('admin/host/transfer', {
      host_id: data.host_id,
      user_id: data.user_id,
      dns_id: data.Dns_id,
      type: data.type,
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

export async function TransferTwo(data) {
  try {
    const request = await Request.post('admin/host/transfer/Two', {
      host_id: data.host_id,
      user_id: data.user_id,
      dns_id: data.Dns_id,
      type: data.type,
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
