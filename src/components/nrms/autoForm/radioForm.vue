<template>
  <div class="flex align-start radioForm">
    <div
      v-if="element.config.prefix"
      class="prefix"
      :style="{
        width: `${element.config.prefixWidth}`,
        'min-width': `${element.config.prefixWidth}`,
        'font-weight': `${element.config.prefixWeight}`,
        'text-align': element.config.prefixAlign
      }"
    >{{element.config.prefix}}</div>
    <el-radio-group v-model="element.value" :disabled="element.config.disabled" class="radio-group" :class="{'radiobox' : element.config.selectBox}">
      <el-radio
        :style="{'margin-right': item.marginRight || element.config.marginRight}"
        v-for="(item) in element.options"
        :key="item.key"
        :label="item.id"
        @change="onChange"
      >
        <span style="white-space: nowrap;line-height: 32px" :style="{'font-size': item.labelSize}">{{item.label}}</span>
        <template v-for="v in item.children">
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
      </el-radio>
    </el-radio-group>
  </div>
</template>
<script>
const Radio = {
  type: 'radio', // type
  value: '', // value
  key: '36', // key
  score: 0, // score
  config: {
    disabled: false, // radio 是否可点击
    prefix: '沟通能力', // radio前label
    prefixWidth: '100px', // radio的label宽度
    prefixAlign: 'right', // radio的label-align
    keyDisabled: '36-3' // radio组件disabled对应value
  },
  options: [
    {
      label: '无', // radio项label
      id: '36-1' // radio项id   id规则当前项的element的key-$index
    },
    {
      label: '不祥',
      id: '36-2'
    },
    {
      label: '有',
      id: '36-3',
      children: [
      ]
    }
  ]
}
export default {
  components: {
    FormCommon: () => import('./FormCommon.vue')
  },
  name: 'radioForm',
  props: ['element', 'valueData', 'data', 'father', 'isEdit'],
  methods: {
    // radio值传到valueData
    onChange (e) {
      this.$emit('changeValue', {
        key: this.element.key,
        value: this.element.value
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./autoForm.scss";
.prefix {
  padding-right: 10px;
  line-height: 32px;
}
</style>
<style lang="scss" scoped>
.radio-group {
  display: flex;
  flex-wrap: wrap;
}
/deep/ .el-radio {
  display: flex;
  line-height: 32px;
  align-items: flex-start;
}
/deep/ .el-radio__label {
  display: flex;
  align-items: flex-start;
}
/deep/ .el-radio__input {
  line-height: 32px;
}

/deep/ .el-radio .el-checkbox {
  height: 32px;
}
.radiobox /deep/.el-radio__inner {
  border-radius: 0;
  position: relative;
}

</style>
