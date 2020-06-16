<template>
  <view class="wm-canlendar">
    <view class="wm-row">
      <view class="wm-column wm-val-default" v-for="(item, index) in headers" :key="index">
        {{ item }}
      </view>
    </view>
    <view class="wm-canlendar-box">
        <view class="wm-bg-ym" v-if="isNeedMaskMonth || isNeedMaskMonth">
          <view class="wm-bg-m" v-if="isNeedMaskMonth">{{ currentMonth }}</view>
          <view class="wm-bg-y" v-if="isNeedMaskYear">{{ currentYear }}</view>
        </view>
        <view class="wm-row" v-for="(row, rowIndex) in canlendars" :key="rowIndex">
          <view
            class="wm-column"
            v-for="(column, columnIndex) in row"
            :key="columnIndex"
            @click="change(rowIndex, columnIndex, column)">
            <view
              class="wm-val-default"
              :class="{ 'wm-val-enabled': !column.enabled }">
              <view :class="{ 'wm-column-active': setColumnActive(rowIndex, columnIndex) }">{{ column.val }}</view>
            </view>
          </view>
        </view>
    </view>
  </view>
</template>

<script>
import { getCanlendar } from './canlendar.js'
export default {
  props: {
    headers: {
      type: Array,
      default: () => ['日', '一', '二', '三', '四', '五', '六']
    },
    year: {
      type: [String, Number],
      default: new Date().getFullYear()
    },
    month: {
      type: [String, Number],
      default: new Date().getMonth() + 1
    },
    isNeedMaskYear: {
      type: Boolean,
      default: false
    },
    isNeedMaskMonth: {
      type: Boolean,
      default: true
    },
    changeMode: {
      type: String,
      default: 'range',
      validator (val) {
        return ['single', 'multiple', 'range'].indexOf(val) !== -1
      }
    },
    isChangeCurrent: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      canlendars: [],
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      changeVal: []
    }
  },
  created () {
    this.currentYear = this.year
    this.currentMonth = this.month
    this.canlendars = getCanlendar(this.year, this.month)
    this.setChangeCurrent()
    console.log(this.canlendars)
  },

  methods: {
    // 选择当前日期
    setChangeCurrent () {
      if (this.changeMode === 'range' && !this.isChangeCurrent) return
      this.canlendars.forEach((r, rowIndex) => {
        r.forEach((c, columnIndex) => {
          if (
            this.year === c.year &&
            this.month === c.month &&
            new Date().getDate() === c.val
          ) {
            this.setChangeValByMode(rowIndex, columnIndex)
          }
        })
      })
    },
    // 通过不同的选择模式来选择值
    setChangeValByMode (rowIndex, columnIndex, item) {
      if (this.changeMode === 'single') {
        this.changeVal = [rowIndex, columnIndex]
      } else if (this.changeMode === 'multiple') {
        const deleteIndex = this.changeVal.findIndex(i => i[0] === rowIndex && i[1] === columnIndex)
        if (deleteIndex !== -1) {
          this.changeVal.splice(deleteIndex, 1)
        } else {
          this.changeVal.push([rowIndex, columnIndex])
        }
      } else if (this.changeMode === 'range') {

      }
    },
    change (rowIndex, columnIndex, item) {
      if (item.enabled) {
        this.setChangeValByMode(rowIndex, columnIndex, item)
      }
    },
    // 设置高亮
    setColumnActive (rowIndex, columnIndex) {
      let _Val = []
      if (this.changeMode === 'single') {
        _Val = [ [...this.changeVal] ]
      } else {
        _Val = this.changeVal
      }
      return _Val.some(i => i[0] === rowIndex && i[1] === columnIndex)
    }
  }
}
</script>

<style lang="less" scoped>
.wm-canlendar {
  .wm-row {
    display: flex;
    position: relative;
    z-index: 1;

  }
  .wm-column {
    flex: 1;
    color: #323233;
  }
  .wm-column-active {
    color: #fff;
    position: absolute;
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: #ee0a24;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wm-val-default {
    position: relative;
    height: 128rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
  .wm-val-enabled {
    color: #c8c9cc;
  }
  .wm-canlendar-box {
    position: relative;
  }

  .wm-bg-ym {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 0;
    color: rgba(242, 243, 245, 0.8);
    pointer-events: none;
    font-size: 240rpx;
  }

  .wm-bg-m {
    font-size: 320rpx;
    margin-top: -10%;
    color: rgba(242, 243, 245, 1);
  }
}
</style>
