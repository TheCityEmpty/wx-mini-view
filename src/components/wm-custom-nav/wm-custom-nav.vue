<template>
  <view class="wm-custom-nav wm-placeholder-box" :style="[wmPlaceholderStyle]">
    <view class="wm-nav">
      <!-- 状态栏 -->
      <view class="wm-status-bar" :style="[wmStatusBarStyle]"></view>
      <!-- title 栏 -->
      <view :class="wmTitleClass" :style="[wmTitleBoxStyle]">
        <slot></slot>
        <!-- 默认模式 -->
        <view class="wm-go-back" :style="[wmTitleBoxStyle]" v-if="$slots.default && navType === 'default'">
          <view
            v-for="(item, index) in gobackLayoutArr"
            :key="index"
            :class="item.className"
            v-if="item.isShow"
            @click="goBack(item.mode)">
            <image :src="type === 'light' ? item.lightImgUrl: item.imgUrl"></image>
          </view>
        </view>
        <!-- 搜索模式 -->
        <view :class="wmSearchClass" :style="[wmTitleBoxStyle]" v-if="!$slots.default && navType === 'search'">
          <input :value="searchVal" class="wm-search-inner"></input>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const systemInfo = uni.getSystemInfoSync()
const brand = systemInfo.brand.toLowerCase()

let rect = null
try {
  // 胶囊按钮位置信息
  rect = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null
} catch (error) {
  rect = { height: 32, top: 24 }
}
const navBarHeight = (rect.height + (rect.top - systemInfo.statusBarHeight) * 2) * 2
const statusBarHeight = systemInfo.statusBarHeight * 2
const realNavHeight = navBarHeight + statusBarHeight
console.log(rect)
console.log('未包括状态栏的导航栏高度:', navBarHeight)
console.log('状态栏高度:', statusBarHeight)
console.log('真实的导航栏高度:', realNavHeight)
export default {
  props: {
    bg: {
      type: String,
      default: '#fff'
    },
    /**
     * @example default 文字模式
     * @example search 搜索模式
     * @example custom 自定义模式
     */
    navType: {
      type: String,
      default: 'default'
    },
    /**
     * @example dark 普通模式
     * @example light 高亮模式
     */
    type: {
      type: String,
      default: 'dark'
    },

    gobackLayout: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      // 未包括状态栏的导航栏高度
      navBarHeight: navBarHeight + 'rpx',
      // 状态栏高度
      statusBarHeight: statusBarHeight + 'rpx',
      // 真实的导航栏高度
      realNavHeight: realNavHeight + 'rpx',
      gobackLayoutArr: [
        {
          mode: 'goBack',
          imgUrl: '/images/arrow-back.svg',
          lightImgUrl: '/images/arrow-back-light.svg',
          isShow: true,
          className: 'go-back',
          clickFn: () => {
            // 默认返回到上一页
            wx.navigateBack()
          }
        },
        {
          mode: 'goHome',
          imgUrl: '/images/home.svg',
          lightImgUrl: '/images/home-light.svg',
          isShow: true,
          className: 'go-home',
          clickFn: () => {
            // 默认返回到index 页面
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        }
      ],
      searchVal: ''
    }
  },
  computed: {
    wmPlaceholderStyle() {
      return {
        height: this.realNavHeight,
        background: this.bg
      }
    },
    wmStatusBarStyle () {
      return {
        height: this.statusBarHeight
      }
    },
    wmTitleBoxStyle (){
      return {
        height: this.navBarHeight
      }
    },
    wmTitleClass (){
      return [
        'wm-title-box',
        `${this.navType === 'default' ? 'wx-title-center' : ''}`,
        `${this.type === 'light' ? 'wx-title-light' : ''}`
      ]
    },
    wmSearchClass (){
      return [
        'wm-search',
         `${this.type === 'light' ? 'wx-search-light' : ''}`
      ]
    }
  },

  created (){
    this.gobackLayoutArr = this.gobackLayoutArr.map(item => {
      const target = this.gobackLayout.find(i => i.mode === item.mode)
      return { ...item, ...(target || {}) }
    })
  },

  methods: {
    goBack (mode) {
      const target = this.gobackLayoutArr.find(i => i.mode === mode)
      target.clickFn()
    }
  }
}
</script>

<style lang="less" scoped>
.wm-custom-nav {
  .wm-nav {
    position: fixed;
    width: 100vw;
    z-index: 9;
    transition: all .3s;
    top: 0;
    left: 0;
  }
  .wm-status-bar {
    width: 100vw;
  }

  .wx-title-light {
    color: #fff;
  }

  .wx-title-center {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: bold;
  }

  .wm-go-back {
    position: absolute;
    top: 0;
    left: 16rpx;
    width: 148rpx;
    border-radius: 32rpx;
    display: flex;
    .go-back, .go-home {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      &:active {
        background: rgba(0 ,0 ,0, 0.1);
        border-radius: 50%;
        box-shadow: 2rpx 2rpx 50rpx 14rpx rgba(0 ,0 ,0, 0.1);
      }
    }
    image {
      width: 44rpx;
      height: 44rpx;
    }
  }
  .wm-search {
    padding: 12rpx;
    width: 60vw;
    box-sizing: border-box;
  }
  .wx-search-light.wm-search {
    .wm-search-inner {
      background: #fff;
      border-color: transparent;
    }
  }
  .wm-search-inner {
    border: 1px solid #dadada;
    border-radius: 10rpx;
    height: 100%;
  }
}
</style>
