import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const Request = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    maxRedirects: 5
})

Request.interceptors.request.use((config)=>{
    NProgress.start()
    return config
},(err)=>{
    // NProgress.done()
    return Promise.reject(err);
})


Request.interceptors.response.use((response)=>{
    NProgress.done()
    return response
},(err)=>{
    // NProgress.done()
    return Promise.reject(err);
})

// RequestWithCancel 创建携带取消能力的请求
// @params: args 请求参数
// @return {request : 请求实例, token: 请求取消Token}
// Example:
/*          import axios from 'axios'
            import { Requst, GetCancelController } from '@/api/request' 
            const requestParams = {
                method: "POST",
                path: "/login",
            }
            const controller = GetCancelController(requestParams)
            setTimeout(()=>{
                controller.abort() // 调用cancel函数取消请求
            }, 500) // 500毫秒若请求未完成则取消请求
            Request(requestParams).then((res)=>{
                ....
            }).catch((err)=>{
                if (axios.isCancel(thrown)) {
                    console.log('Request canceled', thrown.message);
                } else {
                    // 处理错误
                }
            })
*/
function GetCancelController(args) {
    const controller = new AbortController()
    args.signal = controller.signal
    return controller
}

export {
    Request, // 常规请求对象
    GetCancelController, // 创建携带取消能力的请求
}