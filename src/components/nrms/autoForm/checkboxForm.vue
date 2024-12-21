<template>
<div class="flex" :style="{
  'justify-content': element.config.justifyContent
}"
     :class="element.config.noAlignCenter ? '' : 'align-center'"
>
  <div
      v-if="element.config.prefix"
      class="prefix"
      :style="{
        'width': `${element.config.prefixWidth}`,
        'min-width': `${element.config.prefixWidth}`,
        'font-weight': `${element.config.prefixWeight}`,
        'text-align': element.config.prefixAlign
      }"
    >{{element.config.prefix}}</div>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" v-if="element.config.hasAllSelect">全选</el-checkbox>
    <el-checkbox-group
      v-model="element.value"
      size="mini"
      @change="onChange"
      :disabled="element.config.disabled"
      :class="element.config.NocheckboxGroupFlex ? '' : 'checkbox-group'"
    >
      <el-checkbox :class="{'checkbox-hidden': item.checkboxHidden}" :label="item.id" v-for="(item) in element.options" :key="item.id" :style="{'margin-left': item.marginLeft,'margin-right': item.marginRight || element.config.marginRight, 'margin-bottom': item.marginBottom || element.config.marginBottom, width: element.config.optionWidth}">
        <span class="checkLabel" :style="{'font-size': item.labelSize}">{{item.label}}</span>
        <template v-for="v in item.children" class>
          <form-common
            :element="v"
            :data="data"
            :valueData="valueData"
            :father="element"
            :key="v.key"
            style="padding-left: 10px"
            :isEdit="isEdit"
          ></form-common>
        </template>
      </el-checkbox>
    </el-checkbox-group>
  </div>
  <div
      v-if="element.config.suffix"
      class="suffix"
      :style="{
        width: `${element.config.suffixWidth}`,
        'min-width': `${element.config.suffixWidth}`,
        'font-weight': `${element.config.suffixWeight}`,
        'text-align': element.config.suffixAlign
      }"
    >{{element.config.suffix}}</div>
</div>
</template>
<script>
// 与radio类似
const Checkbox = {
  type: 'checkbox',
  key: '28',
  value: [],
  score: 0,
  config: {
    prefix: '',
    prefixWidth: '100px',
    prefixWeight: 'bold',
    prefixAlign: 'right',
    suffix: '',
    suffixWidth: '100px',
    suffixWeight: 'bold',
    suffixAlign: 'right',
    keyDisabled: '36-3',
    disabled: true,
    marginRight: ''
  },
  options: [
    {
      label: '年龄(61-70)岁',
      id: '28-1',
      score: 3,
      checkboxHidden: false // checkbox是否隐藏
    }
  ]
}
export default {
  components: {
    FormCommon: () => import('./FormCommon.vue')
  },
  name: 'checkboxForm',
  props: ['element', 'valueData', 'data', 'father', 'isEdit'],
  data () {
    return {
      isIndeterminate: true,
      checkAll: false
    }
  },
  mounted () {
    this.checkListJudge(this.element.value.length || 0)
    this.isDisabled(this.valueData)
  },
  methods: {
    // 将值返回valueData
    onChange (e) {
			if (this.element.config.isRadio && this.element.value.length > 1) {
				this.element.value = [this.element.value.pop()]
			}
      // 获取当前分值
      let arr = this.element.options
        .filter((item) => this.element.value.indexOf(item.id) >= 0)
        .map((item) => item.score)
      let score = 0
      if (arr && arr.length) {
        score = arr.reduce((total, currentValue) => total + currentValue)
      }
      this.element.score = score
      let checkedCount = e.length
      this.checkListJudge(checkedCount)
      this.$emit('changeValue', {
        key: this.element.key,
        value: this.element.value,
        score: this.element.score
      })
    },
    checkListJudge (checkedCount) {
      this.checkAll = checkedCount === this.element.options.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.element.options.length
    },
    handleCheckAllChange (val) {
      this.isIndeterminate = false
      this.element.value = val ? this.element.options.map(item => item.id) : []
      this.$emit('changeValue', {
        key: this.element.key,
        value: this.element.value,
        score: this.element.score
      })
    },
    isDisabled (newValue) {
      if (this.element.config.keyDisabled) {
        let keyDisabled = this.element.config.keyDisabled.split(',')
        let arr = newValue.map((item) => {
          switch (typeof item.value) {
            case 'string':
              keyDisabled = keyDisabled.filter(v => v != item.value)
              break
            case 'object':
              if (item.value instanceof (Array)) {
                keyDisabled = keyDisabled.filter(v => item.value.indexOf(v) < 0)
              }
              break
            default:
              break
          }
        })
        if (keyDisabled && keyDisabled.length) {
          this.element.config.disabled = true
          this.element.value = []
        } else {
          this.element.config.disabled = false
        }
      }
    }
  },
  watch: {
    valueData: {
      handler (newValue, oldValue) {
        // 根据某一项判断是否为可点击
        this.isDisabled(newValue)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import './autoForm.scss';
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
/deep/ .el-checkbox {
  display: flex;
  align-items: center;
}
/deep/ .el-checkbox__label {
  display: flex;
  align-items: center;
  color: #333;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}
.prefix {
  padding-right: 10px;
}
.suffix {
  padding-left: 10px;
}
.checkbox-hidden {
  /deep/ .el-checkbox__input {
    display: none;
  }
  /deep/ &.is-checked .el-checkbox__label {
    color: #606266;
  }
}
</style>
