import { Request } from '../request'

const path = '/auth/login'
// 登录函数
// @param: username 用户名
// @param: password 密码
export function Login(username, password) {
  return Request.post(path, {
    username,
    password,
  })
}
