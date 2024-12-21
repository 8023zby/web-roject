<template>
  <div class="flex align-center" :class="element.config.noCenter ? '' :'justify-center'">
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
        'color': element.config.prefixColor
      }"
    >{{element.config.prefix}}</div>
    <el-date-picker
      v-if="element.config.type == 'date'"
      v-model="element.value"
      :default-value="element.default == 'now'?new Date():element.value"
      type="date"
      :placeholder="element.config.placeholder"
      :disabled="element.config.disabled"
      :readonly="element.config.readonly"
      :value-format="element.config.format || 'yyyy-MM-dd'"
      @change="onChange"
      :style="{width: `${element.config.width}`}"
      class="border-line"
      :class="{'no-clearable': !element.config.clearable}"
      :clearable="element.config.clearable"
      v-uni:[ColIndex]="element.config.uniId"
    ></el-date-picker>
    <el-time-picker
      v-if="element.config.type == 'time'"
      v-model="element.value"
      :default-value="element.default == 'now'?new Date():element.value"
      :placeholder="element.config.placeholder"
      :disabled="element.config.disabled"
      :readonly="element.config.readonly"
      :value-format="element.config.format || 'HH:mm:ss'"
      :format="element.config.showFormat || 'HH:mm:ss'"
      @change="onChange"
      :style="{width: `${element.config.width}`}"
      class="border-line"
      :class="{'no-clearable': !element.config.clearable}"
      :clearable="element.config.clearable"
      v-uni:[ColIndex]="element.config.uniId"
    ></el-time-picker>
    <el-date-picker
      v-if="element.config.type == 'datetime'"
      v-model="element.value"
      type="datetime"
      :placeholder="element.config.placeholder"
      :disabled="element.config.disabled"
      :readonly="element.config.readonly"
      :value-format="element.config.format || 'yyyy-MM-dd HH:mm:ss'"
      :format="element.config.showFormat || 'yyyy-MM-dd HH:mm:ss'"
      :style="{width: `${element.config.width}`}"
      @change="onChange"
      class="border-line"
      :class="{'no-clearable': !element.config.clearable, 'smallFont': element.config.smallFont}"
      :clearable="element.config.clearable"
      v-uni:[ColIndex]="element.config.uniId"
    ></el-date-picker>
    <!-- <el-input
      :placeholder="element.config.placeholder"
      :disabled="element.config.disabled"
      :readonly="element.config.readonly"
      :style="{width: `${element.config.width}`}"
      v-model="element.value"
      @input="onChange"
    ></el-input>-->
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
        'color': element.config.suffixColor
      }"
    >{{element.config.suffix}}</div>
  </div>
</template>
<script>
const dateForm = {
  'type': 'date',
  'value': '',
  'key': '1603097492000_15437',
  'score': 0,
  'config': {
    'prefix': '日期:',
    'prefixWidth': '80px',
    'suffixWeight': '',
    'prefixAlign': 'right',
    'suffix': '',
    'placeholder': '',
    'width': '150px',
    'disabled': false,
    'readonly': false,
    'type': 'date',
    'clearable': false
  }
}
const moment = require('moment')
export default {
  name: 'dateForm',
  props: ['element', 'valueData', 'data', 'isEdit', 'ColIndex'],
  created () {
    if (this.element.default && this.element.default == 'now' && !this.element.value) { 
      this.element.value = new Date()
    }
  },
  mounted() {
    this.isDisabled(this.valueData)
  },
  methods: {
    onChange (e) {
      this.$emit('changeValue', {
        key: this.element.key,
        value: this.element.value,
        score: 0
      })
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
        this.isDisabled(newValue)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./autoForm.scss";
.prefix {
  padding-right: 10px;
}
.suffix {
  padding-left: 10px;
}
/deep/ .no-clearable .el-input__inner{
  padding-right: 0;
}
</style>
