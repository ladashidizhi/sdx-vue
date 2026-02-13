import { Request } from '../request'
import { Message } from '@arco-design/web-vue'
import axios from 'axios'
//--------------------------消息start---------------------------
//获取消息数量
export function GetClientLinkCount(hostId) {
  return Request.post('/messageNews/clientLinkCount')
}

//
export async function GetLogs(page) {
  try {
    const request = await Request.post('/messageNews/getLogs', {
      page: page.page,
      page_size: page.page_size,
      content: page.content,
      type: page.type,
      important: page.importent,
      addr: page.addr,
      start_time: page.start_time,
      end_time: page.end_time,
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

export async function SetLogs(data) {
  try {
    const request = await Request.post('/messageNews/set', {
      station_window: data.station_window,
      browser_window: data.browser_window,
      app_push: data.app_push,
      push_config: data.push_config,
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

export async function GetMessageLogs() {
  try {
    const request = await Request.post('/messageNews/get', {})
    if (request.code === 7) {
      return request
    } else {
      // Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
export async function SubMessageLogs(data) {
  try {
    const request = await Request.post('/messageNews/edit/Logs', {
      id: data.id,
      is_sure: data.is_sure,
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
//--------------------------消息end---------------------------
const instance = axios.create({
  baseURL: 'http://50.118.254.237:8080/api/v1', // 在这里指定新的 baseURL
})
export async function PostAiTranslate(data) {
  const request = await instance.post('/tools/aiTranslate', {
    mode: data.mode,
    text: data.text,
  })
  if (request.code === 7) {
    Message.error(request.data.msg)
    return request.data
  } else {
    return request.data
  }
}
export async function PostDisturbText(data) {
  const request = await instance.post('/tools/disturbText', {
    text: data.text,
    code: data.code,
    codeRate: data.codeRate,
  })
  if (request.code === 7) {
    Message.error(request.data.msg)
    return request.data
  } else {
    return request.data
  }
}
