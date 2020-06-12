<template>
	<view class="wrap-box">
		<wm-custom-nav :gobackLayout="gobackLayout">wx-mini-view组件库</wm-custom-nav>
	</view>
</template>

<script>
import WxCustomNav from '@_com/wm-custom-nav/wm-custom-nav.vue'
export default {
	components: {
		WxCustomNav
	},
	data() {
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
		this.aa()
	},

	methods: {
		aa () {
			console.log('aaa')
			console.log('cccc')
			console.log('cccc')
		}
	}
}
</script>

<style lang="less">
</style>
