import Vuex from 'vuex'
import Scheduler from '../utils/schedule.js'


const scheduler = new Scheduler()
const defaultState = {
  show: false,
  title: '',
  content: '',
  showCancel: false,
  cancelText: '取消',
  cancelColor: '',
  confirmText: '确认',
  confirmColor: ''
}
export default function initDialog (v) {
  v.use(Vuex)
  v.prototype.$dialogStore = new Vuex.Store({
    state: { ...defaultState },

    mutations: {
      openDialog (state, data = {}) {
        state = Object.assign(state, { ...data, show: true })
      },
      closeDialog (state) {
        state = Object.assign(state, { ...defaultState })
      }
    }
    
  })

  v.prototype.$openDialog = (options) => {
    return scheduler.add(() => {
      return new Promise(resolve => {
        v.prototype.$dialogStore.commit('openDialog', options)
        v.prototype.$EventEmeitter.removeListener('$closeDialog')
        v.prototype.$EventEmeitter.addListener('$closeDialog', type => {
          const closeFn = () => {
            v.prototype.$dialogStore.commit('closeDialog', options)
            // 关闭dialog 之后执行下一个 dialog
            scheduler.schedule()
          }
          resolve({type, closeFn})
        })
      })
    })
    
  }
}
