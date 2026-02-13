import { Request } from '../request'

// 获取访问日志统计信息
export async function getAccessLogStatistics(data) {
  const request = await Request.post('/seo/access-log/statistics', data)
  if (request.code === 7) {
    throw request
  }
  return request
}

// 获取访问日志列表
export async function getAccessLogList(data) {
  const request = await Request.post('/seo/access-log/list', data)
  if (request.code === 7) {
    throw request
  }
  return request
}

