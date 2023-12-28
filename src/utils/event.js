/* 事件池 */

// 事件回调拦截器
function callbackInject(ev, list, next) {
    return (...params) => {
      const result = ev.fn(next, ...params)
      if (ev.once) {
        const index = list.list.findIndex(item => item.id === ev.id)
        if (index > -1) {
          list.list.splice(index, 1)
          let resultCallback = null
          for (let i = list.list.length - 1; i > -1; i--) {
            resultCallback = callbackInject(list.list[i], list, list.list[i + 1] ? resultCallback : (_) => _)
          }
          list.start = resultCallback
        }
      }
      return result
    }
  }
  
  // 删除事件触发函数
  EventPool.prototype.removeEventListener = function (eventName, id) {
    if (!this.event_taker[eventName]) { return }
    const index = this.event_taker[eventName].list.findIndex(item => item.id === id)
    if (index > -1) {
      this.event_taker[eventName].list.splice(index, 1)
      let resultCallback = null
      for (let i = this.event_taker[eventName].list.length - 1; i > -1; i--) {
        resultCallback = callbackInject(this.event_taker[eventName].list[i], this.event_taker[eventName], this.event_taker[eventName].list[i + 1] ? resultCallback : (_) => _)
      }
      this.event_taker[eventName].start = resultCallback
    }
  }
  
  // 触发一次立即停止
  EventPool.prototype.once = function (eventName, callback, capture = false) {
    return this.addEventListener(eventName, callback, capture, true)
  }
  
  // 注册事件触发函数
  EventPool.prototype.addEventListener = function (eventName, callback, capture = false, once = false) {
    if (!this.event_taker[eventName]) {
      console.warn(`无效的事件: ${eventName}`)
      return
    }
    const eventList = this.event_taker[eventName].list
    const id = (new Date().getTime() + (Math.random() * (0xffff + 1))).toString()
    const callbackObj = { id, fn: callback, once }
    if (capture) {
      this.event_taker[eventName].list.unshift(callbackObj)
    } else {
      this.event_taker[eventName].list.push(callbackObj)
    }
    let resultCallback = null
    for (let i = eventList.length - 1; i > -1; i--) {
      resultCallback = callbackInject(eventList[i], this.event_taker[eventName], eventList[i + 1] ? resultCallback : (_) => _)
    }
    this.event_taker[eventName].start = resultCallback
    this.event_taker[eventName].prepare_list.forEach((args) => {
      resultCallback(...args)
    })
    this.event_taker[eventName].prepare_list = []
    return id
  }
  
  // 注册事件
  EventPool.prototype.registerEvent = function (events, prefix = '') {
    for (const name in events) {
      if (typeof events[name] === 'object') {
        this.registerEvent(events[name], prefix + name + '_')
      } else if (events[name]) {
        this.event_taker[prefix + name] = { list: [], start: null, prepare_list: [] }
      } else {
        console.warn(`不被注册的事件: ${prefix + name}`)
      }
    }
  }
  
  // 触发事件
  EventPool.prototype.emit = function (eventName, ...params) {
    const res = this.event_taker[eventName]
    if (!res) {
      console.warn(`触发了不存在的事件: ${eventName}`)
      return
    }
    if (res.list.length === 0) {
      res.prepare_list.push(params)
      return
    }
    return res.start(...params)
  }
  
  function EventPool() {
    // Event List
    this.event_taker = {}
  }
  
  export default EventPool
  