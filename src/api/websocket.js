const TYPECODE = {
    "AUTH": "auth",
    "ERROR": "error"
}


// SendMessage 发送websocket消息
export function SendMessage(ws, type, data){
    ws.send(JSON.stringify({"time": new Date().getTime(), "type": type, data: data}))
}

// SendAuth 发送Token认证信息
export function SendAuth(ws, token){
    return SendMessage(ws, TYPECODE.AUTH, token)
}
