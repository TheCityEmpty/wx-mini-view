<template>
  <view class="wm-dialog" v-show="show">
    <view class="wm-mask" @touchmove.stop.prevent=""></view>

    <view class="wm-dialog-box">
      <view class="wm-dialog-content">
        <view class="wm-dialog-title" :class="{ 'wm-dialog-tile-body': title && content }" v-show="title">{{ title }}</view>
        <view class="wm-dialog-body" v-show="content">{{ content }}</view>
        <view class="wm-dialog-footer">
          <button class="cancel wm-btn" @click="clickFn('cancel')">取消</button>
          <button class="confirm wm-btn" @click="clickFn('confirm')">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  computed: {
    show () {
      return this.$dialogStore.state.show
    },
    title () {
      return this.$dialogStore.state.title
    },
    content () {
      return this.$dialogStore.state.content
    }
  },
  methods: {
    clickFn (type) {
      this.$EventEmeitter.emit('$closeDialog', type)
    }
  },
  beforeDestroy () {
    this.$EventEmeitter.removeListener('$closeDialog')
  }
}
</script>

<style lang="less" scoped>
.wm-dialog {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 19;

  .wm-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
  }

  .wm-dialog-box {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wm-dialog-content {
    width: calc(100vw - 128rpx);
    border-radius: 20rpx;
    background: #fff;
    overflow: hidden;

    .wm-dialog-title {
      padding: 32rpx;
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
       text-align: center;
    }

    .wm-dialog-body {
      padding: 32rpx;
      text-align: center;
      font-size: 32rpx;
      color: #646566;
      border-bottom: 2rpx solid #f8f9fa;

    }

    .wm-dialog-tile-body {
      padding-bottom: 0!important;
    }

    .wm-dialog-footer {
      height: 100rpx;
      display: flex;
      .wm-btn {
        background: #fff;
        border-radius: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 2rpx solid #f8f9fa;
        flex: auto;
        font-size: 32rpx;
        &:after {
          border: 0 none !important;
        }
        &:last-child {
          border-right: none;
        }
      }
    }

    .confirm.wm-btn {
      color: #3370ff;
      &:active {
        color: #82a7fc;
      }
    }
    .cancel.wm-btn {
      color: #1f2329;
      &:active {
        color: #656464;
      }
    }
  }
}
</style>
