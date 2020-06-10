<template>
<view class="placeholder-box" :style="{ height: realNavHeight + 'rpx', background: bg}">
  <view class="custom-nav" :style="{ background: bg }">
    <view class="status-bar" :style="{ height: `${statusBarHeight}rpx`}"></view>
    <view class="custom-nav-box" :style="{ height: `${navBarHeight}rpx` }">
      <view class="custom-go-back">
        <!-- <view class="go-back" v-show="isNeedGoBack" @click="goBack">
          <image :src="`/static/imgs/arrow-back${type === 'light' ? '-light' : ''}.svg`"></image>
        </view>
        <view class="go-home" @click="goHome">
          <image :src="`/static/imgs/home${type === 'light' ? '-light' : ''}.svg`"></image>
        </view> -->
      </view>
      <slot></slot>
    </view>
  </view>
</view>
</template>
<script>
const systemInfo = uni.getSystemInfoSync()
const brand = systemInfo.brand.toLowerCase()

let rect = null
try {
  rect = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null // 胶囊按钮位置信息
} catch (error) {
  rect = { height: 32 }
}
console.log(rect)
const navBarHeight = (rect.height + 10) * 2
const statusBarHeight = systemInfo.statusBarHeight * 2
const realNavHeight = navBarHeight + statusBarHeight

export default {
  data () {
    return {
      // 状态栏高度
      statusBarHeight,
      // 真实的导航栏高度
      realNavHeight,
      // 除去状态栏 的导航栏高度
      navBarHeight
    }
  },
  props: {
    bg: {
      type: String
    },
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.nav-light.custom-nav {
   .custom-nav-box {
     color: #fff;
   }
}
.custom-nav {
  position: fixed;
  width: 100%;
  z-index: 99;
  transition: all .3s;
  background-color: #fff;
  top: 0;
  left: 0;
  .status-bar {
    width: 100%;
  }
  .custom-nav-box {
    position: relative;
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: bold;
  }
  .custom-go-back {
    position: absolute;
    left: 16rpx;
    width: 176rpx;
    height: 64rpx;
    border-radius: 32rpx;
    display: flex;
    .bg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -1;
    }
    .go-back, .go-home {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    image {
      width: 44rpx;
      height: 44rpx;
    }
  }
}
</style>