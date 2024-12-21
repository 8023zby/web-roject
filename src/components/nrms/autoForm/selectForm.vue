<template>
  <div  class="flex align-center" :style="{
  'justify-content': element.config.justifyContent
}">
    <div
        v-if="element.config.prefix"
        class="prefix"
        :style="{
          'width': `${element.config.prefixWidth}`,
          'min-width': `${element.config.prefixWidth}`,
          'font-weight': `${element.config.prefixWeight}`,
          'text-align': element.config.prefixAlign,
          'padding-right': element.config.prefixPaddingRight,
          'font-size': element.config.prefixFontSize,
          'color': element.config.prefixColor
        }"
      >{{element.config.prefix}}</div>
    <el-select
      @keydown.native="nextFocus"
      :style="{
        width: element.config.width,
      }"
      v-model="element.value"
      :disabled="element.config.disabled"
      :placeholder="element.config.placeholder || ''"
      @change="onChange"
      :size="element.config.size"
      :clearable="element.config.clearable"
      :filterable="element.config.filterable"
      :allow-create="element.config.allowCreate"
      v-uni:[ColIndex]="element.config.uniId"
    >
      <el-option
        v-for="item in element.options"
        :key="item.key"
        :label="item.label"
        :value="item.id"
      >
      </el-option>
    </el-select>
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
export default {
  name: 'selectForm',
  props: ['element', 'valueData', 'data', 'father', 'isEdit', 'ColIndex'],
  mounted() {
    this.isDisabled(this.valueData)
  },
  methods: {
    // 将值返回valueData
    onChange (e) {
      // 获取当前分值
      this.$emit('changeValue', {
        key: this.element.key,
        value: this.element.value
      })
    },
    nextFocus (e) {
      let parent = this.$parent
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
        this.isDisabled(newValue)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./autoForm.scss";
</style>
