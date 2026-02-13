import { Request } from '../request'
import { Message } from '@arco-design/web-vue'
// 添加采集
export async function PostCollection(data) {
  try {
    const request = await Request.post('/collection/create', data)
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

// 修改采集
export async function PutCollection(data) {
  try {
    const request = await Request.put(
      '/collection/update',
      {
        name: data.name,
        domains: data.domains,
        verify: data.verify,
      },
      {
        params: { id: data.id },
      }
    )
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

//删除采集
export async function DelCollection(id) {
  try {
    const request = await Request.delete(`/collection/delete?id=${id}`)
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

//获取采集站点列表
export async function CollectionList(data) {
  const request = await Request.get('/collection/list', {
    params: {
      page: data.page,
      limit: data.pageSize,
      domain: '',
    },
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

//获取采集站点的注入JS
export async function CollectionJs(id) {
  try {
    const request = await Request.get(`/collection/js?id=${id}`)
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
