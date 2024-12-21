<template>
  <div
    class="flex align-center"
    :class="element.config.noCenter ? '' : 'justify-center'"
  >
    <div
      v-if="element.config.prefix"
      class="prefix"
      :style="{
        width: `${element.config.prefixWidth}`,
        'min-width': `${element.config.prefixWidth}`,
        'font-weight': `${element.config.prefixWeight}`,
        'text-align': element.config.prefixAlign,
        'padding-right': element.config.prefixPaddingRight,
        'font-size': element.config.prefixFontSize,
        color: element.config.prefixColor,
      }"
    >
      {{ element.config.prefix }}
    </div>
    <el-input
      @keydown.native="nextFocus"
      :type="element.config.inputType"
      :autosize="
        element.config.autosize
          ? element.config.autosize
          : element.config.autosize === false
          ? false
          : true
      "
      :placeholder="element.config.placeholder"
      :disabled="element.config.disabled"
      :size="element.config.size"
      :readonly="element.config.readonly"
      :clearable="element.config.clearable ? element.config.clearable : false"
      :class="{
        'border-line': element.config.borderLine,
        'has-padding': element.config.hasPadding,
        'text-hasAlign': element.config.hasTextAlign,
      }"
      :style="{
        width: `${element.config.width}`,
      }"
      :maxlength="element.config.maxlength"
      v-model="element.value"
      :rows="element.config.rows || 1"
      @input="onChange"
    ></el-input>
    <div
      v-if="element.config.suffix"
      class="suffix"
      :style="{
        width: `${element.config.suffixWidth}`,
        'min-width': `${element.config.suffixWidth}`,
        'font-weight': `${element.config.suffixWeight}`,
        'text-align': element.config.suffixAlign,
        'padding-left': element.config.suffixPaddingLeft,
        'font-size': element.config.suffixFontSize,
        color: element.config.suffixColor,
      }"
    >
      {{ element.config.suffix }}
    </div>
  </div>
</template>
<script>
import { ApiAssManage } from '../../../api/nrms/index'
//  input 字段
const Input = {
  type: 'input', // 类型
  value: '', // 值
  key: '', // key Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
  score: 0, // 分支
  config: {
    inputType: '',
    borderLine: '', // 是否显示下划线
    total: [], // 根绝那几个key计算分值
    prefix: '', // input框前字段
    prefixWidth: '', // input匡倩字段宽度
    prefixAlign: '', // input框前字段align
    suffix: '', // input框后字段
    suffixWidth: '', // input框后字段宽度
    suffixAlign: '', // input框align
    placeholder: '', // input框placeholder
    width: '', // input框宽度
    disabled: false, // input是否禁止输入
    readonly: false, // input框是否只读
    keyDisabled: '36-3', // input框disabled对应value
    maxlength: 20, // 最大输入值
    autosize: true // 是否自适应，textarea
  },
  // 如果有级别
  options: [
    {
      interval: '0-10', // 级别只有这三种形式
      label: '低风险' // 级别的label
    },
    {
      interval: '21',
      label: '不高不低风险'
    },
    {
      interval: '22+',
      label: '高风险'
    }
  ]
}

export default {
  name: 'inputForm',
  props: ['element', 'valueData', 'data', 'isEdit', 'assId'],
  created () {
    if (
      this.element.config &&
      this.element.config.default &&
      !this.element.value
    ) {
      switch (this.element.config.default) {
        case 'nurseName':
          let empInfo = JSON.parse(localStorage.getItem('empInfo'))
          this.element.value = empInfo.empName
          break
        default:
          break
      }
    }
  },
  mounted () {
    this.isDisabled(this.valueData)
  },
  methods: {
    // 获取相应分数，传回到value
    onChange (e) {
      this.element.score = Number(e)
      this.$emit('changeValue', {
        key: this.element.key,
        value: this.element.value,
        score: this.element.score
      })
    },
    nextFocus (e) {
      let parent = this.$parent
      if (!parent || !parent.nextFocus) {
        return
      }
      while (!parent.nextFocus) {
        parent = parent['$parent']
      }
      parent.nextFocus(e)
    },
    isDisabled (newValue) {
      // 根据某一项判断是否为可点击
      if (this.element.config.keyDisabled) {
        let keyDisabled = this.element.config.keyDisabled.split(',')
        let arr = newValue.map((item) => {
          switch (typeof item.value) {
            case 'string':
              keyDisabled = keyDisabled.filter((v) => v != item.value)
              break
            case 'object':
              if (item.value instanceof Array) {
                keyDisabled = keyDisabled.filter(
                  (v) => item.value.indexOf(v) < 0
                )
              }
              break
            default:
              break
          }
        })
        if (keyDisabled && keyDisabled.length) {
          this.element.config.disabled = true
          this.element.value = ''
        } else {
          this.element.config.disabled = false
        }
      }
    }
  },
  watch: {
    valueData: {
      async handler (newValue, oldValue) {
        let totalValue
        // 如果有total就调用计算属性，计算所选项的和
        if (this.element.config.total && this.element.config.total.length) {
          // 筛选所有total中包含的数组
          let filterValue = newValue.filter((item) => this.element.config.total.indexOf(item.key) >= 0)
          if (filterValue.every(item => !item.value || !item.value.length)) {
            // 如果都没有选中
            this.element.value = ''
            this.element.score = 0
            this.valueData.map(item => {
              if (item.key == this.element.config.setColorKey) {
                item.value = ''
              }
            })
          } else {
            // 拿出所有分值
            let arr = filterValue
              .map((item) => item.score)
            let score = 0
            // 累加
            if (arr && arr.length) {
              score = arr.reduce((t, c) => t + c)
            }
            // 如果有options，则为评级，根据score计算评级
            if (this.element.options && this.element.options.length) {
              this.element.score = score
              let value = ''
              this.element.options.map((item) => {
                if (/\-/.test(item.interval)) {
                  let arr = item.interval.split('-')
                  if (score >= arr[0] && score <= arr[1]) {
                    value = item.label
                  }
                } else if (/\+/.test(item.interval)) {
                  let arr = item.interval.split('+')
                  if (score >= arr[0]) {
                    value = item.label
                  }
                } else if (/^\d+$/.test(item.interval)) {
                  if (score == Number(item.interval)) {
                    value = item.label
                  }
                }
              })
              if (!this.element.config.scoreColor) this.element.value = value
              else totalValue = value
            } else {
              // 否则就为计算分数
              if (!this.element.config.scoreColor) {
                this.element.value = score
                this.element.score = score
              } else totalValue = score
            }
            // 计算风险等级
            if (this.element.config.scoreColor) {
              let scoreLevel = await ApiAssManage.getScoreColor({
                assId: this.assId,
                score: totalValue
              })
              this.element.value = scoreLevel.data ? scoreLevel.data.level : ''
              if (this.element.config.setColorKey) {
                if (scoreLevel.data && scoreLevel.data.levelColor) {
                // 将颜色赋值
                  this.valueData.map(item => {
                    if (item.key == this.element.config.setColorKey) {
                      item.value = scoreLevel.data.levelColor
                    }
                  })
                } else {
                  this.valueData.map(item => {
                    if (item.key == this.element.config.setColorKey) {
                      item.value = ''
                    }
                  })
                }
              }
            }
          }
          // 最后赋值传回给valueData
          this.$emit('changeValue', {
            key: this.element.key,
            value: this.element.value,
            score: this.element.score
          })
        }
        this.isDisabled(newValue)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./autoForm.scss";
.border-line {
  /deep/ .el-input__inner {
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    /*outline: medium;*/
  }
  /deep/ .el-textarea__inner {
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
  }
}
/deep/ input.el-input__inner {
  padding: 0 15px;
  color: #333;
}
/deep/ .el-textarea__inner {
  padding: 0;
  color: #333;
}
/deep/ .has-padding input.el-input__inner {
  padding: 0 15px;
}
/deep/ .has-padding input.el-textarea__inner {
  padding: 0 15px;
}
/deep/ .text-hasAlign input.el-input__inner {
  text-align: center;
}
</style>
<style lang="scss">
</style>
