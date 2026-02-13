import { Request } from '../request'
import { Message } from '@arco-design/web-vue'
// SEO概览
export async function postSearchGroups(data) {
  try {
    const request = await Request.post('/groups/website/search', {
      page: data.page,
      pageSize: data.pageSize,
      info: data.info,
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
