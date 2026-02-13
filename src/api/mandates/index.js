import { Request } from '../request'
import { Message } from '@arco-design/web-vue'
// 任务管理器
export async function GetTkmList(data) {
  const request = await Request.get('/tkm/list', {
    params: {
      limit: data.limit,
      offset: data.offset,
      host_id: data.host_id,
    },
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

export async function GetTkmLog(data) {
  const request = await Request.get('/tkm/log', {
    params: {
      limit: data.limit,
      offset: data.offset,
      id: data.id,
    },
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

export async function PutTkmOperator(data) {
  const request = await Request.put(
    `/tkm/operator?id=${data.id}&op=${data.op}`,
    {}
  )
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}
