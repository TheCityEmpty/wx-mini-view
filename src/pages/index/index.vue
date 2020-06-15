<template>
	<view class="wrap-box">
		<wm-custom-nav :gobackLayout="gobackLayout">wx-mini-view组件库</wm-custom-nav>
		<button @click="open">打开dialog</button>
		<wm-dialog></wm-dialog>
	</view>
</template>

<script>
import WxCustomNav from '@_com/wm-custom-nav/wm-custom-nav.vue'

export default {
  components: {
    WxCustomNav
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
    this.$openDialog({
      title: 'asd',
      content: '第一次打开dialog'
    }).then(res => {
      console.log(res)
      res.closeFn()
    })
  },

  methods: {
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
