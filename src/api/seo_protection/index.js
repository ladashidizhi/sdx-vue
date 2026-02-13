import { Request } from '@/api/request'
import { Message } from '@arco-design/web-vue'

// 获取SEO防护IP名单列表
export async function GetSeoProtectionIPList(data) {
  try {
    const response = await Request({
      method: 'POST',
      url: '/seo/ip/list',
      data,
    })
    if (response.code === 0) {
      return response.data
    } else {
      Message.error(response.msg || '获取IP名单列表失败')
      return null
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return null
  }
}

// 删除SEO防护IP记录
export async function DeleteSeoProtectionIP(id) {
  try {
    const response = await Request({
      method: 'DELETE',
      url: `/seo/ip/list/${id}`,
    })
    if (response.code === 0) {
      Message.success('删除成功')
      return true
    } else {
      Message.error(response.msg || '删除失败')
      return false
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return false
  }
}

// 获取SEO防护统计数据
export async function GetSeoProtectionStats() {
  try {
    const response = await Request({
      method: 'GET',
      url: '/seo/ip/stats',
    })
    if (response.code === 0) {
      return response.data
    } else {
      Message.error(response.msg || '获取统计数据失败')
      return null
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return null
  }
}

