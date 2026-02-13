import { Request } from '@/api/request'
import { Message } from '@arco-design/web-vue'

// 获取蜘蛛类型列表
export async function GetSpiderTypeList(data) {
  try {
    const response = await Request({
      method: 'POST',
      url: '/seo/spider-type/list',
      data,
    })
    if (response.code === 0) {
      return response.data
    } else {
      Message.error(response.msg || '获取蜘蛛类型列表失败')
      return null
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return null
  }
}

// 获取单个蜘蛛类型
export async function GetSpiderType(id) {
  try {
    const response = await Request({
      method: 'GET',
      url: `/seo/spider-type/${id}`,
    })
    if (response.code === 0) {
      return response.data
    } else {
      Message.error(response.msg || '获取蜘蛛类型失败')
      return null
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return null
  }
}

// 创建蜘蛛类型
export async function CreateSpiderType(data) {
  try {
    const response = await Request({
      method: 'POST',
      url: '/seo/spider-type',
      data,
    })
    if (response.code === 0) {
      Message.success('创建成功')
      return true
    } else {
      Message.error(response.msg || '创建失败')
      return false
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return false
  }
}

// 更新蜘蛛类型
export async function UpdateSpiderType(data) {
  try {
    const response = await Request({
      method: 'PUT',
      url: '/seo/spider-type',
      data,
    })
    if (response.code === 0) {
      Message.success('更新成功')
      return true
    } else {
      Message.error(response.msg || '更新失败')
      return false
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return false
  }
}

// 删除蜘蛛类型
export async function DeleteSpiderType(id) {
  try {
    const response = await Request({
      method: 'DELETE',
      url: `/seo/spider-type/${id}`,
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

// 获取日志配置
export async function GetLogConfig() {
  try {
    const response = await Request({
      method: 'GET',
      url: '/seo/log/config',
    })
    if (response.code === 0) {
      return response.data
    } else {
      Message.error(response.msg || '获取配置失败')
      return null
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return null
  }
}

// 更新日志配置
export async function UpdateLogConfig(data) {
  try {
    const response = await Request({
      method: 'POST',
      url: '/seo/log/config',
      data,
    })
    if (response.code === 0) {
      Message.success('更新成功')
      return true
    } else {
      Message.error(response.msg || '更新失败')
      return false
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return false
  }
}

// 获取访问日志MySQL配置
export async function GetAccessLogMysqlConfig() {
  try {
    const response = await Request({
      method: 'GET',
      url: '/seo/access-log-mysql/config',
    })
    if (response.code === 0) {
      return response.data
    } else {
      Message.error(response.msg || '获取配置失败')
      return null
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return null
  }
}

// 更新访问日志MySQL配置并同步到所有客户端
export async function UpdateAccessLogMysqlConfig(configContent) {
  try {
    const response = await Request({
      method: 'POST',
      url: '/seo/access-log-mysql/config',
      data: {
        config_content: configContent,
      },
    })
    if (response.code === 0) {
      Message.success('配置已保存并同步到所有客户端')
      return true
    } else {
      Message.error(response.msg || '更新失败')
      return false
    }
  } catch (e) {
    Message.error(e.message || '请求失败')
    return false
  }
}

