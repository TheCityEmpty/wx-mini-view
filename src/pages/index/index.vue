<template>
	<view class="wrap-box">
		<wm-custom-nav>组件详情介绍</wm-custom-nav>
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
			title: 'Hello'
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
