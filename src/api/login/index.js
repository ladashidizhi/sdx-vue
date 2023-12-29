import { Request } from "../request";

// 登录函数
// @param: username 用户名
// @param: password 密码
export function Login(username, password) {
    return Request.post("/auth/login",{
        username, password
    })
}