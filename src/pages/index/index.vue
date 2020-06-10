<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
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
	.content {
		text-align: center;
		height: 400upx;
		.logo {
				height: 200upx;
				width: 200upx;
				margin-top: 400upx;
			}
	}


	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
