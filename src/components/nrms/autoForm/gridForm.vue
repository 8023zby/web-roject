<template>
<!-- 表格画法为左上边框是当前大的grid项画，而右下边框是小的grid项画 -->
  <div
    class="flex grid"
    :style="{
      'border-width': 0,
      'border-style': element.config.borderStyle,
      'border-color': element.config.borderColor,
      'border-top-width': isFirstGrid && fatherIsNotGrid ? `${element.config.borderWidth}`: 0,
      'border-left-width': fatherIsNotGrid ? `${element.config.borderWidth}`: 0,
      'margin': element.config.margin,
    }"
  >
    <div
      v-for="(item, index) in element.columns"
      class="flex wrap grid-columns"
      :key="index"
      :class="{'borderRight' : item.borderRight}"
      :style="{
        width: `${item.width}`,
        height: `${item.height}`,
        flex: item.flex,
        'padding': item.padding,
        'border-width': 0,
        'border-right-width': childrenIsNotGrid(item) ? `${element.config.borderWidth}`: 0,
        'border-bottom-width': childrenIsNotGrid(item) ? `${element.config.borderWidth}`: 0,
        'border-style': element.config.borderStyle,
        'border-color': element.config.borderColor,
        'justify-content': item.justify,
        'align-items': item.align,
        'flex-direction': item.direction,
        'flex-wrap': item.wrap
      }"
    >
      <div
        v-for="v in item.children"
        :key="v.key"
        :style="{
          'margin-bottom': `${item.gapTB}`,
          'margin-top': `${item.gapTB}`,
          'margin-left': `${item.gapLR}`,
          'margin-right': `${item.gapLR}`,
          'width': item.childWidth
        }"
      >
        <template>
          <form-common :element="v" :data="data" :valueData="valueData" :father="element" :isEdit="isEdit" :tempList="tempList" :patient="patient"></form-common>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
// grid项
const Grid = {
  type: 'grid',
  key: '4', // Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
  config: {
    borderWidth: '1px', // 表格宽度和颜色
    borderColor: '#ddd',
    borderStyle: 'solid'
  },
  columns: [
    {
      width: '', // 可以固定宽度
      flex: 1, // 也可以flex布局
      align: 'center', // 表格每一项align-items
      justify: 'space-between', // 表格每一项justify
      direction: 'row', // 表格方向
      gapTB: '5px', // 表格间距
      gapLR: '',
      childWidth: 'auto', // 子表格宽度
      padding: '10px', // 表格padding
      children: [] // 子表格内容
    }
  ]
}
export default {
  components: {
    FormCommon: () => import('./FormCommon.vue')
  },
  name: 'gridForm',
  props: ['element', 'valueData', 'data', 'father', 'isEdit','tempList','patient'],
  computed: {
    // 获取是否是第一个表格，如果是则在表格加上边框和左边框
    isFirstGrid () {
      let index = this.data.findIndex(item => item.key == this.element.key)
      if (this.data[index - 1] && this.data[index - 1].type == 'grid') {
        // 如果上一个类型是grid
        if (this.data[index - 1].config.borderWidth == 0 || this.data[index - 1].config.borderWidth == '0' || this.data[index - 1].config.borderWidth == '0px') return true
        // 并且上一个没有border
        return false
      } else if (this.data[index - 1] && this.data[index - 1].type == 'table_column_loop') {
        // 如果上一个是否是循环表格
        return false
      } else {
        // 其他类型则有上边框和左边框
        return true
      }
    },
    // 判断父表格是否为gird，如果是则不在表格上加上边框和左边框
    fatherIsNotGrid () {
      return !this.father || this.father.type != 'grid' || (this.father.type == 'grid' && (this.father.config.borderWidth == 0 || this.father.config.borderWidth == '0' || this.father.config.borderWidth == '0px'))
    }
  },
  data () {
    return {}
  },
  methods: {
    // 判断子表格是否为gird，如果是则当前列不加下边框和右边框
    childrenIsNotGrid (item) {
      if (!item.children || item.children.length == 0) return true
      if (item.children.every(v => v.type != 'grid')) return true
      if (!item.children.some(v => v.type == 'grid' && (v.config.borderWidth != 0 && v.config.borderWidth != '0' && v.config.borderWidth != '0px'))) return true
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./autoForm.scss";
.grid .grid-columns {
  box-sizing: border-box;
}
.grid {
  box-sizing: border-box;
}
.borderRight{
  border-right: 1px solid rgb(221, 221, 221) !important;
}
</style>
<style lang="scss">
</style>
