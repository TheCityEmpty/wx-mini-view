<template>
  <view class="wm-canlendar">
    <view class="wm-select">
      <view class="wm-year-prev wm-select-img"></view>
      <view class="wm-month-prev wm-select-img" @click="prev"></view>
      <view class="wm-y-m">
        <view class="wm-y">{{ currentYear }} 年</view>
        <view class="wm-m">{{ currentMonth }} 月</view>
      </view>
      <view class="wm-month-next wm-select-img" @click="next"></view>
      <view class="wm-year-next wm-select-img"></view>
    </view>
    <view class="wm-row">
      <view class="wm-column wm-val-default" v-for="(item, index) in headers" :key="index">
        {{ item }}
      </view>
    </view>
    <view class="wm-canlendar-box">
        <view class="wm-bg-ym" v-if="monthWatermark || yearWatermark">
          <view class="wm-bg-m" v-if="monthWatermark">{{ currentMonth }}</view>
          <view class="wm-bg-y" v-if="yearWatermark">{{ currentYear }}</view>
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
              <view :class="{
                'wm-column-active': column.enabled && setColumnActive(column),
                'wm-column-range_active': column.enabled && setColumnRangeActive(column)
              }">{{ column.val }}</view>
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
    // 日历头部
    headers: {
      type: Array,
      default: () => ['日', '一', '二', '三', '四', '五', '六']
    },
    // 当前年
    year: {
      type: [String, Number],
      default: new Date().getFullYear()
    },
    // 当前月
    month: {
      type: [String, Number],
      default: new Date().getMonth() + 1
    },
    // 是否展示年水印
    yearWatermark: {
      type: Boolean,
      default: false
    },
    // 是否展示月水印
    monthWatermark: {
      type: Boolean,
      default: true
    },
    // 选择模式 单选、多选、范围选择
    changeMode: {
      type: String,
      default: 'range',
      validator (val) {
        return ['single', 'multiple', 'range'].indexOf(val) !== -1
      }
    },
    // 是否默认选中当天， 只在单选、多选模式生效
    isChangeCurrent: {
      type: Boolean,
      default: false
    },
    // 多选模式下可选择数量
    multipleCount: {
      type: Number,
      default: 5
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
    this.toggleCanlendar(this.year, this.month)
    this.setChangeCurrent()
  },

  methods: {
    toggleCanlendar (y, m) {
      this.currentYear = y
      this.currentMonth = m
      this.canlendars = getCanlendar(y, m)
    },
    // 选择当前日期
    setChangeCurrent () {
      if (this.changeMode === 'range' || !this.isChangeCurrent) return
      this.canlendars.forEach((r, rowIndex) => {
        r.forEach((c, columnIndex) => {
          if (
            this.year === c.year &&
            this.month === c.month &&
            new Date().getDate() === c.val
          ) {
            this.setChangeValByMode(rowIndex, columnIndex, c)
          }
        })
      })
    },
    // 通过不同的选择模式来选择值
    setChangeValByMode (rowIndex, columnIndex, item) {
      let error = {}
      if (this.changeMode === 'single') {
        this.changeVal = [ { rowIndex, columnIndex, ...item } ]
      } else if (this.changeMode === 'multiple') {
        const dateIndex = this.changeVal.findIndex(i => i.dateStr === item.dateStr)
        if (dateIndex !== -1) {
          this.changeVal.splice(dateIndex, 1)
        } else {
          if (this.changeVal.length >= this.multipleCount) {
            // 超过多选数量
            error = { type: 'overMultipleCount', msg: `当前选择数量不可超过多选限制数量，限制数量为${this.multipleCount}` }
          } else {
            this.changeVal.push({ rowIndex, columnIndex, ...item })
          }
        }
      } else if (this.changeMode === 'range') {
        const dateIndex = this.changeVal.findIndex(i => i.dateStr === item.dateStr)
        // 范围模式时 选择不同日期才行
        if (this.changeVal.length < 2 && dateIndex === -1) {
          this.changeVal.push({ rowIndex, columnIndex, ...item })
        } else {
          this.changeVal.length = 0
          this.changeVal.push({ rowIndex, columnIndex, ...item })
        }

        if (this.changeVal.length === 2) {
          // 排序日期
          this.changeVal = this.changeVal.sort((p, n) => {
            const firstDate = Number(`${p.year}${this.supply0(p.month)}${this.supply0(p.val)}`)
            const endDate = Number(`${n.year}${this.supply0(n.month)}${this.supply0(n.val)}`)
            return firstDate - endDate
          })
        }
      }

      this.$emit('change', this.changeVal, error)
    },
    change (rowIndex, columnIndex, item) {
      if (item.enabled) {
        this.setChangeValByMode(rowIndex, columnIndex, item)
      }
    },
    // 设置高亮
    setColumnActive (item) {
      return this.changeVal.some(i => i.dateStr === item.dateStr)
    },
    // 设置范围的高亮
    setColumnRangeActive (item) {
      if (this.changeMode !== 'range') return
      if (this.changeVal.length === 2) {
        const p = this.changeVal[0]
        const n = this.changeVal[1]
        const firstDate = Number(`${p.year}${this.supply0(p.month)}${this.supply0(p.val)}`)
        const endDate = Number(`${n.year}${this.supply0(n.month)}${this.supply0(n.val)}`)
        const targetDate = Number(`${item.year}${this.supply0(item.month)}${this.supply0(item.val)}`)

        if (targetDate > firstDate && targetDate < endDate) {
          return true
        }
      }
    },

    prev () {
      if (this.currentMonth === 1) {
        this.currentMonth = 13
        this.currentYear -= 1
      }
      this.toggleCanlendar(this.currentYear, this.currentMonth - 1)
    },

    next () {
      if (this.currentMonth === 12) {
        this.currentMonth = 0
        this.currentYear += 1
      }
      this.toggleCanlendar(this.currentYear, this.currentMonth + 1)
    },
    supply0 (n) {
      return n < 10 ? `0${n}` : n
    }
  }
}
</script>

<style lang="less" scoped>
.wm-canlendar {
  .wm-select {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx 0 0 0;
  }
  .wm-select-img {
    width: 54rpx;
    height: 54rpx;
    background-size: 100%;
    margin: 0 20rpx;
  }
  .wm-month-prev {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABeUlEQVR4Xu3YwW3DMAyF4QiepDvk1K7Qa7KGBS/QdgAD9BrNIJ0gOWcSuxDQQ1DkIpOS+CjmHBv6P0k+MBw6/4XO+w8O4CegcwG/Ap0fAP8I+hXwK9C5QNMrME3T+7quRyL6bLUPzQDGcTyFEL7/wi9EdG6B0ATgX3zq/iGi1y4AnsRfh2E4z/N8Mw+gLT6BV7sCGuOrAWiNrwKgOb44gPb4ogAI8cUAUOKLACDFiwOgxYsCIMaLAaDGiwAgx7MB0ONZABbidwNYid8FYCk+G8BafDZAjDENLz8eJjdfLQeaEhOk7IFIjDENMk9WELIBUrglhF0AlhB2A1hBYAFYQGADoCOIACAjiAGgIogCICKIA6AhFAFAQigGgIJQFAABoTiAdoQqAJoRqgFoRagKoBGhOoA2hCYATxDuRPQiMeLKfUczgAeEt23b4rIsl9zFS/y/KYBEAPcdDsAVRH/eTwD6DnLX7yeAK4j+vJ8A9B3krt9PAFcQ/flfM/DpQfe/ByEAAAAASUVORK5CYII=);
  }
  .wm-month-next {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACIElEQVR4Xu2awUoDMRCGJ30MTz6GVx+iIoiIICJi2RUREUQUEaSI+SuIiIgiIuhTePchPPkclUK9lIYm2UxmyqbXnZnM9+3MHkINtfxnWs5PRUCZgJYbKCvQ8gEoH8GyAmUFWm6grADHAFRV1TXG9InoG8AKxxmparJMQF3Xv0S0MG7yA8BqqoZT1+ES8ElE3f9mjTHv1tq11M2nqMciYNRYXdeTEt6stespmk5Zg03ANAlE9ApgIyVA01qsAhwSXgBsNm08VT67AMc6PFlrt1JBNKmTRYBDwqO1drtJ8ylyswlwrMMDgJ0UILE1sgpwSLgHsBsL0DQvuwCHhDsAe01hYvJFBDi+CbfW2ioGokmOmADHJADAfhOg0FxRAQ4JNwAOQkFi48UFOCRcAziMhQrJUyHAIaEP4CgEJiZWjYBpEobD4dVgMDiOAfPNUSXAMQmXAE58gULj1AlwSLgAcBoK5xOvUoBDwjmAMx+okBi1AhwSlgF8hQDOilUrYPJGiYjaMwG54EfToW4CcsKrE5AbXpUACXg1AqTgVQiQhBcXIA0vKkADvJgALfAiAjTBZxegDT6rAI3w2QRohc8iQDM8uwDt8KwC5gGeTcC8wHMK+CGixfF1FMtNzqyrLt/nLBcivV5vqdPpPBtjRn+RS36R6QvnE8ciwOdgLTFFgJY3IdVHmQAp81rOLROg5U1I9VEmQMq8lnPLBGh5E1J9/AEL1dBBTgTTSAAAAABJRU5ErkJggg==);
  }
  .wm-year-prev {
    width: 44rpx;
    height: 44rpx;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEbUlEQVR4Xu3b72scRRgH8OfZe5N3ySvf+FL6Rl8q4jv/imyQihRFRNs4zxBEEbEJIgaR29lLcpSgSFFEvVJaSin1R6nVaktrW2tLbW1LraalFKkWCeWSu0emTOGoGe9udmZ3j9y8Chw72e/nnnlub2cPYZ0PXOf5YQgwrIB1LjBcAkUXABFNA8CTAPCNUkr/nXkIIcYRcRwAflNKvfJ/ExZaAVLKGWZ+05zgNaXUg1nTm/Cf35sHETckSXLRNm9hAFLKt5j5jXsnxsz1NE03ZwG4PzwAHFNKPV66ChBCvI2Ir3ecWEMpFXsOf67dbse1Wu1MqQCEEO8g4muBw5/XPSBJkp+7oea6BKSUs8z8auDwv0ZRNF6tVn/qFl6/nhuAlPJdZu7syN7LnpkvVSoVHf5kL+FzAxBCvIeIU4Hf+ctmzf/Ya/hcAIQQVUSUgcNfYeY4TdNj/YQPDkBECQBQ4PBXTfij/YYPCiClTJn55cDh/zAN74hL+GAAQog5RNwSMjwzXzMN73vX8EEAhBALiPhSyPAAcN00vO+yhPcOQER1AHgxcPgbZs0fyhreKwARbQOAFwKHvwkAsVLqoI/w3gCklIvM/Hzg8H+a8Ad8hfcCIIR4HxGfCxmemW+Zhve1z/CZAYjoAwB4NmR4APibmcfTNP3Sd/hMAET0IQBsChz+tml4+0OEdwYgou0A8Ezg8P+YNb8vVHgnACHER4j4dODwyyb83pDh+wYgoo8BYGPI8Mx8J4qiOEmSPaHD9wVARJ8AwFMhwwNA01zh7c4jfM8ARPQpAEwEDr9iyn5XXuF7AiCiz/SJBQ7fMuF35hm+K8DU1NTDrVbrrM/wei4iOg4Aj5p52YTfkXf4rgCTk5MPVSqVzk2FHeb2tT5p50FEeuNC79zcHeazvuE8YYYDu94UNVtXWzv+x86lpaW40WjosnUaprI0wiNFI3QFMCWr9+w6EXYtLy/Hi4uLunE5jbIg9ARgQdg9Ojoaz8zMNJ0EAKAMCD0DWBD2jI2NxdPT03cGFaEvAAvCXrMc9OWr0yiyEvoGsCDsazabcb1e119gnEZRCE4AFoT9rVYrnpubu+0kUFBPcAawIHyhL5mVUn8NCkImAAvCVyMjI/Hs7OytQUDIDGBBOLCyshIvLCzoG5lOI6+e4AXAgnDQ9AR9K9tp5IHgDcCCcMhc599wEsihMXoFsCB8axrj9TIieAewIBxGxIkkSZbKhhAEwILwQxRFE9Vq9fcyIQQDsCAcNff8rpYFISiABUE/xqI3OK+UASE4gAXhuOkJl4tGyAXAgnDCIFif4+2G4+M6ITcAC8Ip0xgvdAtrez0rQq4AFoTTq6urE/Pz878UgZA7gAVBP9CsG+O5vBEKAbB9RCqlnnAF0MettRza7fZjtVrN+vRoYQBrINxUSj2QBWAtBETcnCSJfnhrzVEoQAeC/snMKaVU5yO1zhamEu7+HkEp1bmV/585CwdwTunpwCGAJ8iBnWZYAQP71nk68XVfAf8C07AlbhUq5coAAAAASUVORK5CYII=);
  }
  .wm-year-next {
    width: 44rpx;
    height: 44rpx;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADjklEQVR4Xu3b34tMYRjA8ec5kSTSJhub/P7RSkhaIUQSWklsIm0iScz7vDtJhHYTSRrv0iaRJNLaW+XanXLh1oULN8o/sfvorWfrtOzOmTnvc86ZH3O1tTNnz/cz7zxzzplZhBa/YYv3QxugvQJaXKD9EphpAVhrO5j5DgB0MfPY8PDwWIgFQ0SDALAXAL445/zPud1mXAHGmB5E/Dq5d8zcFwKBiH4DwFLZ7lCeCNUAOhHxT/zpCYFgjBlBxCux7eaGUHUGENFJABgFgCjkSiCijwBwKm+EqgB+B4nohCDMajaERACCcBwA/LM2u5kQEgP4aGPMMUT0CHOaBaEmAB9tre1lZj8T5jYDQs0A8nI4KjNhXqMj1AUgCIcFYX4jI9QNIDPhkMyEBY2KkApAEA4KwsJGREgN4KMHBgYOTExM+HeHjkZDCAIgM2G/zIRFygiDzrmhUGdPwQAEYR8ijjLz4kZBCAogM2GPzITORkAIDuCjS6XS7iiK/ExYUnQEFQAZjDtlMHYVGUENQBB2CMKyoiKoAshM6ImiyA/G5UVEUAcQhO0yGFcUDSETABmM22QwrioSQmYAMhO2ykxYo4yQ+BpjpgCCsFkQ1hUBIXMAH22t3eQvrzHzhrwRcgEQhI2C0C0IP51za9Me40+92hxFUW+lUvk03XZzAyiXy93j4+P+aNFD+Nsv59zKAAD+cl1fbDtHnHOfCwXwn3i/f4kH13QxxpgPiHg69vsx51wc45+HZr4CtOKtte+Z+Uwt8f6+mQJoxRPROwA4W2t8pgCK8W8B4Fw98ZkBKMa/AYD+euMzAdCKt9a+ZubzaeLVARTjXzHzhbTxqgBa8UT0EgAuhohXA1CMfwEAl0LFqwBoxRtjniPi5ZDxwQG04q21I8wc/0pN1SO8pIfUwQ6EFOOfMfPV0M/85PaCAGjFE9FTALimFR/kJaAY7/yXUjTjUwNoxRtjKohoteNTASjGP0bEchbxdQNoxVtrHzHz9azi6wJQjH/IzDeyjK8ZQCueiB4AwM2s42sC0Io3xtxHxFt5xCcGUIy/h4i384pPBKAVb60dYua7ecYnAiCi7wCwJbajqa/eEhEBwJO846sCGGPWI+KPkPF+W1M+vAh2YpP0BCh+v6rnAv54nJlXI+K3UP/ZQUS7AMC/5fkPQ0r17Hiox1QFCPWHirqdNkBRn5ms9qu9ArKSLurfafkV8Ben/9Rf1Pc8mwAAAABJRU5ErkJggg==);
  }
  .wm-y-m {
    display: flex;
    font-size: 28rpx;
    margin: 0 80rpx;
    .wm-y {
      margin-right: 10rpx;
    }
  }
  .wm-row {
    display: flex;
    position: relative;
    z-index: 1;

  }
  .wm-column {
    flex: 1;
    color: #323233;
  }
  .wm-column-range_active,.wm-column-active {
    color: #fff;
    position: absolute;
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: rgba(238, 10, 36, 1);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wm-column-range_active {
    background: rgba(238, 10, 36, 0.1);
    color: rgba(238, 10, 36, 1);
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
