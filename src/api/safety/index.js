import { Request } from '../request'
import { Message } from '@arco-design/web-vue'
// 查询ssl 证书
export async function postNginxList(data) {
  try {
    const request = await Request.post('/nginx/list', data)
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

// 默认概览页面
export async function getDashboard() {
  try {
    const request = await Request.get('/dashboard')
    if (request.code === 7) {
      throw request
    } else {
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
