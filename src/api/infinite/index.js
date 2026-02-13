import { Request } from '../request'
import { Message } from '@arco-design/web-vue'

//--------------------------泛目录---------------------------
//
export async function InfiniteList(data) {
  const request = await Request.get('/infinite_website/list', {
    params: {
      hostId: data.hostId,
      pageSize: data.pageSize,
      page: data.page,
      tag: data.tag,
      domain: data.domain,
    },
  })
  if (request.code === 7) {
    Message.error(request.msg)
    throw request
  } else {
    return request
  }
}

// 删除网站
export async function DelInfinite(data) {
  try {
    const request = await Request.post('/infinite_website/del', {
      websiteId: data.websiteId,
      forceDelete: data.forceDelete,
      domains: data.domains,
      description: data.description,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
    }
    return request
  } catch (e) {
    Message.error(e.msg)
  }
}

// 通过 id 查询网站
export async function getInfiniteID(id) {
  const request = await Request.get(`/infinite_website/${id}`)
  if (request.code === 7) {
    Message.error(request.msg)
  } else {
    return request
  }
}

export function UpdateInfinite(data) {
  return Request.post('/infinite_website/update', data)
}

// AddWebSite 创建站点
/*
    {

    }
*/
export function AddInfinite(data) {
  return Request.post('/infinite_website', data)
}

///查询网站广告设置
export async function getInfiniteAds(websiteId) {
  const request = await Request.get(`/infinite_website/${websiteId}/ads`)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///更新网站广告设置
export async function postInfiniteAds(data) {
  const request = await Request.post('/infinite_website/ads', {
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
export async function getInfiniteFriend(websiteId) {
  const request = await Request.get(
    `/infinite_website/${websiteId}/friendChain`
  )
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

//更新网站友链设置
export async function postInfiniteFriend(data) {
  const request = await Request.post('/infinite_website/friendChain', {
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

//--------------------------泛目录---------------------------
