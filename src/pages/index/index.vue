<template>
	<view class="wrap-box">
		<wm-custom-nav bg="rgba(237, 237, 237)" type="light" navType="search"></wm-custom-nav>
		<view style="background: #fff;height: 100px;width: 100vw;"></view>
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
			gobackLayout: []
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
