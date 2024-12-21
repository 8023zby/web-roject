<template>
  <!--周月编辑排班-->
  <div :style="{background: style.background, color: style.color}">
    <el-select v-if="flag"
               ref="select"
               v-model="value"
               clearable
               filterable
               placeholder="请选择"
               :popper-append-to-body="true"
               @focus="selectFocus"
               @change="dealData">
      <el-option v-for="item in dutyData"
                 :key="item.value"
                 :label="item.shiftName"
                 :value="item.shiftId">
      </el-option>
    </el-select>
    <span v-else>{{dutyName}}</span>
  </div>
</template>

<script>
export default {
  name: 'shift-manage',
  props: {
    srcData: null,
    dataId: null,
    flag: null,
    dutyData: null,
    row: null,
    col: null,
    type: null,
    color: null,
    dutyColor: null
  },
  data () {
    return {
      dutyName: '',
      value: '',
      style: {
        background: '',
        color: ''
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        // console.log(val)
        // console.log(this.dutyColor)
        this.calStyle(val)
      }
    }
  },
  created () {
    this.dutyName = this.srcData[this.dataId]
    this.value = this.srcData[this.dataId + '__shiftId']
    this.calStyle(this.value)
  },
  // 数据处理
  methods: {
    calStyle (val) {
      if (this.dutyColor) {
        if (val) {
          if (this.dutyColor[val]) {
            this.style = {
              background: this.dutyColor[val].backgroundColor || '',
              color: this.dutyColor[val].foregroundColor || ''
            }
          } else {
            this.style = {
              background: '',
              color: ''
            }
          }
        } else {
          this.style = {
            background: '',
            color: ''
          }
        }
      }
      this.$forceUpdate()
      // console.log(this.style)
      if (this.style.color) {
        this.$nextTick(function () {
          // 使文字赋值颜色
          // eslint-disable-next-line no-undef
          $('#' + this.col + '-' + this.row + ' .el-select .el-input__inner').css('color', this.style.color)
        })
      }
    },
    blur () {
      this.$refs.select.blur()
    },
    dealData (val) {
      let obj = {}
      let dutyObj = this.dutyData.find((item) => {
        return item.shiftId === val
      })
      if (!dutyObj) dutyObj = {}
      if (this.type === 'rule') {
        obj['dutyWeek'] = this.dataId
      } else {
        obj['dutyDate'] = this.dataId
      }
      obj['accountName'] = this.srcData.accountName
      obj['accountId'] = this.srcData.accountId
      obj['shiftId'] = val
      obj['sort'] = this.col + 1
      obj['shiftName'] = dutyObj.shiftName || ''
      const index = parseInt(this.row) * 7 + parseInt(this.col)
      this.$emit('dealSelData', obj, index)
    },
    selectFocus () {
      this.$emit('dealSelFocus', this.col + '-' + this.row)
    }
  }
}
</script>

<style scoped>
  /deep/ .el-input__inner {
    background: transparent;
  }
</style>
