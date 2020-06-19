<template>
	<view class="wrap-box">
		<wm-custom-nav :gobackLayout="gobackLayout">wx-mini-view组件库</wm-custom-nav>
		<button @click="open">打开dialog</button>
    <wm-canlendar @change="canlendarChange"></wm-canlendar>
		<wm-dialog></wm-dialog>
	</view>
</template>

<script>
import WxCustomNav from '@_com/wm-custom-nav/wm-custom-nav.vue'
import WxCanlendar from '@_com/wm-canlendar/wm-canlendar.vue'
export default {
  components: {
    WxCustomNav,
    WxCanlendar
  },
  data () {
    return {
      gobackLayout: [
        {
          mode: 'goHome',
          isShow: false
        },
        {
          mode: 'goBack',
          isShow: false
        }
      ]
    }
  },

  onLoad () {
  },

  methods: {
    canlendarChange (val) {
      console.log(val)
    },
    open () {
      this.$openDialog().then(res => {
        console.log(res)
        res.closeFn()
      })
    }
  }
}
</script>

<style lang="less">
</style>
