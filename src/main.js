import Vue from 'vue'
import App from './App'
import initWxMiniView from '@_com/init.js'
import initDialog from '@_com/wm-dialog/init.js'
import WxDialog from '@_com/wm-dialog/wm-dialog.vue'

initDialog(Vue)
Vue.component('wm-dialog', WxDialog)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
