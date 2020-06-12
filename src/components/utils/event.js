export default class EventEmeitter {
  constructor () {
   // 事件队列
   this._event = this._event || new Map()
  }
 
  // 触发监听事件
  emit (eventName, ...args) {
     const handleEvent = this._event.get(eventName)
 
     if (Array.isArray(handleEvent)) {
       handleEvent.forEach(e => {
         if (args.length > 2) {
           e.apply(this, args)
         } else {
           e.call(this, args)
         }
       })
     } else {
       if (args.length > 0) {
         handleEvent.apply(this, args)
       } else {
         handleEvent.call(this)
       }
     }
    
     
  }
 
  // 添加监听事件
  addListener (eventName, fn) {
    const handleEvent = this._event.get(eventName)
    if (!handleEvent) {
       this._event.set(eventName, fn)
    } else if (handleEvent && typeof handleEvent === 'function') {
       this._event.set(eventName, [handleEvent, fn])
    } else {
       handleEvent.push(fn)
    }
  }
 
  // 移除监听函数
  removeListener (eventName, fn) {
   const handleEvent = this._event.get(eventName)
   if (handleEvent) {
     if (eventName && fn) {
       // 提供了 fn 参数
       if (typeof handleEvent === 'function') {
         this._event.delete(eventName, fn)
       } else {
         const postion = handleEvent.findIndex(e => e === fn)
         if (postion !== -1) {
           handleEvent.splice(postion, 1)
           if (handleEvent.length === 1) {
             this._event.set(eventName, handleEvent[0])
           }
         }
       }
     } else if (eventName && !fn) {
       // 未提供 fn 参数， 删除该name 下所有监听
       this._event.delete(eventName)
     }
   }
  }
 
  removeAllListener () {
    this._event.clear()
  }
 
 }
 