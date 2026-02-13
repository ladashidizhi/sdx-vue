import { Request } from '../request'
import { Message } from '@arco-design/web-vue'
import { isRule } from '@/utils/judgemental.js'

// 克隆全局配置
export async function getCloneConfig() {
  const request = await Request.get('/websites/clone/config')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

// 全局配置泛目录
export async function getCloneConfigFml() {
  const request = await Request.get('/websites/clone/config?business_type=2')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

// 更新克隆全局配置
//@param: id 克隆ID
//@param: isChange 0可见 1不可见
//@param: context 初始值 除按钮组件
//@param: status 默认值 false 关闭 true开启
//@param: sort 排序值
export async function postCloneConfig(list, id,business_type=1) {
  const request = await Request.post('/websites/clone/configUpdate', {
    config: list,
    id: id,
    business_type:business_type
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

//访问策略4
//基本数据
//render规则接口
//规则引擎字段
export function postRuleField() {
  return Request.post('/render/ruleField')
}

// 生成表达式
//@param: data [{ "file": "Bot","operator": "==", "value": "google","next": "and"}]
//@param: file 字段 operator 表达式 value 值 next 拼接类型
export function getRule(data) {
  return Request.post('/render/getRule', { data })
}

//拦截规则列表
export function postRuleList(data) {
  return Request.post('/render/ruleList', {
    page: data.page,
    page_size: data.page_size,
    website_id: data.website_id,
  })
}

//拦截规则拖拽排序
//@param: data 列表
//@param: id ，sort 排序值
export function postDragSort(data) {
  return Request.post('/render/dragSort', { data })
}

//创建拦截规则
export function postCreate(data) {
  return Request.post('/render/create', {
    method: data.method, //采取措施
    host_id: data.host_id,
    name: data.name, //规则名称
    re_code: data.re_code, //301 302
    rule: data.rule, //表达式
    rule_url2_ua: data.rule_url2_ua, //重定向地址判断条件
    status: data.status, //生效 1生效 2不生效  no
    url1: data.url1, //反向代理地址、重定向地址
    url2ua: data.url2ua, //反向代理 no
    website_id: data.website_id, //
    rule_json: data.rule_json,
  })
}
//修改拦截规则
export function postEdit(data, id) {
  return Request.post('/render/edit', {
    id: id,
    method: data.method, //采取措施
    host_id: data.host_id,
    name: data.name, //规则名称
    re_code: data.re_code, //301 302
    rule: data.rule, //表达式
    rule_url2_ua: data.rule_url2_ua, //重定向地址判断条件
    status: data.status, //生效 1生效 2不生效  no
    url1: data.url1, //反向代理地址、重定向地址
    url2ua: data.url2ua, //反向代理 no
    website_id: data.website_id, //
    rule_json: data.rule_json,
  })
}

//删除拦截规则
export function postDel(id) {
  return Request.post('/render/del', { id })
}

//应用拦截规则
//@param: website_id站点ID
//@param: ID
export function postCopyRule(id, website_id) {
  return Request.post('/render/copyRule', { id, website_id })
}
//是否应用拦截规则

//@param: ID
//@param: status 应用状态 0关闭 1开启
export function postStatusEdit(id, status) {
  return Request.post('/render/statusEdit', { id, status })
}

//查询CFWaf列表
export async function getWaf() {
  const request = await Request.get('/websites/cf/security/waf')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    // Message.success(request.msg)
    return request
  }
}

//创建CFWaf

export async function postAddWaf(data) {
  try {
    const request = await Request.post('/websites/cf/security/waf', {
      status: data.status,
      name: data.name,
      action: data.action,
      expression: data.expression,
      sort: data.sort,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

//修改CFWaf

export async function postUpdateWaf(data, id) {
  try {
    let newData = data.map((item) => {
      let newItem = { ...item }
      delete newItem.index
      return newItem
    })
    const request = await Request.post('/websites/cf/security/wafUpdate', {
      id: id,
      rules: newData,
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

//删除CFWaf
export async function postDelWaf(data) {
  try {
    const request = await Request.post('/websites/cf/security/wafDelete', {
      id: data.id,
      rule: data.rule,
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

///获取默认规则全部配置
export async function getDefaultPageRule() {
  try {
    const request = await Request.get('/websites/cf/rule/defaultPageRule')
    if (request.code === 7) {
      throw request
    } else {
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///获取页面规则
export async function getCfRule() {
  try {
    const request = await Request.get('/websites/cf/rule/page')
    if (request.code === 7) {
      throw request
    } else {
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
///创建页面规则
export async function postAddRule(data) {
  try {
    const request = await Request.post('/websites/cf/rule/page', {
      config: data.config,
      status: data.status,
      itype: data.itype,
      id: data.id,
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

///删除页面规则
export async function postDeleteRule(data) {
  const request = await Request.post('/websites/cf/rule/pageDelete', {
    id: data.id,
    itype: data.itype,
  })
  return request
}

///同步到服务器
export async function Synchronous(data) {
  try {
    const request = await Request.post('/render/synchronous', data)
    if (request.code === 7) {
      return request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///去服务器
export async function AntiHTMLSynchronous() {
  try {
    const request = await Request.get('/websites/antiHTML/synchronous')
    if (request.code === 7) {
      return request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///失败重试服务器
export async function RetrySynchronous(ids) {
  try {
    const request = await Request.post('/websites/antiHTML/retrySynchronous', {
      host_ids: ids,
    })
    if (request.code === 7) {
      return request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
