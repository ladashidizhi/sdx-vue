// 构建 WebSocket URL
export function buildWebSocketUrl(path) {
  if (import.meta.env.MODE === "development") {
    return import.meta.env.VITE_APP_WS_BASE_URL + path;
  }
  
  const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL;
  const isHttps = window.location.protocol.indexOf("https") > -1;
  
  // 如果是完整 URL，直接替换协议
  if (apiBaseUrl.startsWith('http://') || apiBaseUrl.startsWith('https://')) {
    return apiBaseUrl.replace(/^https?:\/\//, isHttps ? "wss://" : "ws://") + path;
  }
  
  // 如果是相对路径，使用 window.location.host
  return `${isHttps ? "wss" : "ws"}://${window.location.host}${apiBaseUrl}${path}`;
}

// 创建一个新的WebSocket
export function CreateNewWebSocket(url, binaryType){
    let t = null, running = true
    function connect(connected, reconnected, close, message, error, reconnect){
        clearTimeout(t)
        let ws = null
        try{
            ws = new WebSocket(url)
            if(binaryType){
                ws.binaryType = binaryType
            }
            ws.addEventListener('close', (e)=>{
                (reconnect ? null : close(e))
                t = running ? setTimeout(()=>connect(connected, reconnected, close, message, error, true), 3000) : null
            })
            ws.addEventListener('error', (e)=>{
                (reconnect ? null : error(e))
                t = running ? setTimeout(()=>connect(connected, reconnected, close, message, error, true), 3000) : null
            })
            ws.addEventListener("open", (e)=>{
                reconnect ? reconnected(ws, e) : connected(ws, e)
                reconnect = false
            })
            ws.addEventListener("message", message)
        }catch(e){
            t = running ? setTimeout(()=>connect(connected, reconnected, close, message, error, true), 3000) : null
        }

        return ()=>{
            ws?.close()
            running = false
        }
    }

    return connect
}