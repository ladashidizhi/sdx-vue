import { Request } from '../request'
import { Message } from '@arco-design/web-vue'

// --------用户管理--------
// 设置用户信息
export async function SetSelfInfo(datas) {
  try {
    const data = {}
    const request = await Request.put('/user/SetSelfInfo', data)
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

// 用户修改密码
export async function ChangePassword(datas) {
  const data = {
    newPassword: datas.newPassword,
    password: datas.password,
    id: datas.id,
  }
  const request = await Request.post('/user/changePassword', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

// 删除用户
export async function DeleteUser(id) {
  try {
    const request = await Request.delete('/user/deleteUser', {
      data: { id: id },
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

// 获取用户信息
export async function GetUserInfo() {
  const request = await Request.get('/user/getUserInfo')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

// 分页获取用户列表
export async function getUserList() {
  const data = {
    keyword: '',
    page: 1,
    pageSize: 500,
    is_parent: true,
  }
  const request = await Request.post('/user/getUserList', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

// 获取组长列表（供「所属组长」下拉使用）
export async function getSeoLeaderList() {
  const request = await Request.get('/user/seo-leader/list')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  }
  return request
}

// 重置用户密码
export async function ResetPassword(id) {
  try {
    const request = await Request.post('/user/resetPassword', {
      id: id,
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

// 设置用户权限
export async function setUserAuthorities(data) {
  const request = await Request.post('/user/setUserAuthorities', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

// 用户修改密码
export async function setUserAuthority(datas) {
  const data = {
    authorityId: 0,
  }
  const request = await Request.post('/user/setUserAuthority', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

// 编辑用户
export async function setUserInfo(data) {
  const request = await Request.put('/user/setUserInfo', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

// 添加用户
export async function addUser(data) {
  const request = await Request.post('/user/addUser', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}
//------- 日志分析 --------
// 查询
export async function getSpider() {
  const request = await Request.get('/spider/es/list')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

// 修改
export async function editSpider(data) {
  try {
    const request = await Request.post('/spider/es/edit', data)
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///用户权限列表
export async function getAuthorityList() {
  const request = await Request.post('/authority/getAuthorityList', {
    page: 1,
    pageSize: 500,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

//------ 权限 ------
///获取所有权限列表

export async function getAllApis() {
  const request = await Request.post('/apis/getAllApis')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
// 获取权限列表
export async function casbinList(authorityId) {
  const request = await Request.post('/casbin/getPolicyPathByAuthorityId', {
    authorityId: authorityId,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

// 更新权限
export async function updateCasbin(data) {
  const request = await Request.post('/casbin/updateCasbin', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

///创建角色
export async function createAuthority(data) {
  const request = await Request.post('/authority/createAuthority', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

///编辑角色
export async function updateAuthority(data) {
  const request = await Request.post('/authority/updateAuthority', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

///删除角色
export async function deleteAuthority(id) {
  const request = await Request.post('/authority/deleteAuthority', {
    authorityId: id,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

///拷贝角色
export async function copyAuthority(data) {
  const request = await Request.post('/authority/copyAuthority', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}

///----- 站点管理 ------

//站点管理
export async function websiteList(data) {
  const request = await Request.post('/admin/website/list', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///------ 蜘蛛ip ------
///列表
export async function spiderList(from) {
  const data = {
    page: from.page,
    pageSize: from.pageSize,
    IType: from.IType,
    ip: from.ip,
    botName: from.botName,
    dataSource: from.dataSource,
  }
  const request = await Request.post('/admin/spider/list', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///添加
export async function spiderAdd(data) {
  const request = await Request.post('/admin/spider', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///删除
export async function spiderDel(ip) {
  const request = await Request.post('/admin/spider/del', { ip: ip })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///更新
export async function spiderUpdate(data) {
  const request = await Request.post('/admin/spider/update', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///变更蜘蛛
export async function spiderChange(data) {
  const request = await Request.post('/admin/spider/change', data)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
///同步蜘蛛
export async function spiderSynchronous() {
  const request = await Request.get('/admin/spider/synchronous')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}
///收录订阅
export async function IncludeState() {
  const request = await Request.get('/plugin/include/state')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

export async function Include(data) {
  const request = await Request.get(`/plugin/include/${data}`)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///---------------start 菜单 角色 -----------

///菜单列表
export async function getMenuList() {
  const request = await Request.get('/menu/tree')
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///创建菜单
export async function PostMenuAdd(data) {
  const request = await Request.post('/menu/create', {
    name: data.name,
    title: data.title,
    path: data.path,
    icon: data.icon || "",
    redirect: data.redirect || "",
    component: data.component || "",
    sort: data.sort,
    status: data.status,
    hidden: data.hidden,
    noCache: data.noCache,
    alwaysShow: data.alwaysShow,
    breadcrumb: data.breadcrumb,
    activeMenu: data.activeMenu || "",
    parentId: data.parentId || 0,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
///修改菜单
export async function PatchMenuUpdate(data) {
  const request = await Request.post(`/menu/update/${data.ID}`, {
    name: data.name,
    title: data.title,
    path: data.path,
    icon: data.icon,
    redirect: data.redirect,
    component: data.component,
    sort: data.sort,
    status: data.status,
    hidden: data.hidden,
    noCache: data.noCache,
    alwaysShow: data.alwaysShow,
    breadcrumb: data.breadcrumb,
    activeMenu: data.activeMenu,
    parentId: data.parentId,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
///删除菜单
export async function GetMenuDel(list) {
  const request = await Request.delete('/menu/delete/batch', {
    data: { menuIds: list },
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
///角色创建
export async function PostRoleAdd(data) {
  const request = await Request.post('/role/create', {
    name: data.name,
    keyword: data.keyword,
    status: data.status,
    sort: data.sort,
    desc: data.desc,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
///角色修改
export async function PostRoleUpdate(data) {
  const request = await Request.post(`/role/update/${data.ID}`, {
    name: data.name,
    keyword: data.keyword,
    status: data.status,
    sort: data.sort,
    desc: data.desc,
    ID: data.ID,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}
///删除角色
export async function GetRoleDel(list) {
  const request = await Request.delete('/role/delete/batch', {
    data: { roleIds: list },
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
///角色列表
export async function GetRoleList(data) {
  const request = await Request.get('/role/list', {
    params: {
      name: data.name,
      keyword: data.keyword,
      status: data.status,
      pageNum: data.pageNum,
      pageSize: data.pageSize,
    },
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
///角色权限
export async function RoleMenusUpdate(data) {
  const request = await Request.post(`/role/menus/update/${data.id}`, {
    menuIds: data.list,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    Message.success(request.msg)
    return request
  }
}
///查询权限
export async function GetTree(id) {
  const request = await Request.get(`/menu/access/tree/${id}`)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///角色拥有权限
export async function Getmenus(id) {
  const request = await Request.get(`/role/menus/get/${id}`)
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}


///查询代理列表
export async function getUserProxy() {
  try {
    const request = await Request.get('/user/proxy')
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

//新增代理
export async function postUserProxy(data) {
  try {
    const request = await Request.post('/user/proxy', {
      proxy_string: data.proxy_string
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


//修改代理
export async function editUserProxy(data) {
    const request = await Request.put('/user/proxy', data)
    if (request.code === 7) {
      Message.error(request.msg)
      return request
    } else {
      Message.success(request.msg)
      return request
    }
}
