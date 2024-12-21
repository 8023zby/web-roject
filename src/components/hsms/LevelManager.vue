<template>
    <div>
        <el-select v-if="(type === 'select') && (curRow!==''&& selectArr.indexOf(`,${row},`)>-1)"
                   v-model="value"
                   clearable
                   filterable
                   placeholder="请选择"
                   @change="dealData">
            <el-option
                    v-for="item in selData"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
            </el-option>
        </el-select>
        <el-input v-else-if="(type === 'text') && (curRow!==''&& selectArr.indexOf(`,${row},`)>-1)"
                  v-model="name"
                  placeholder="请输入"
                  @change="dealData"
                  clearable></el-input>
        <!--<el-input-number :min="0"-->
                         <!--:precision="1"-->
                         <!--:step="0.1"-->
                         <!--controls-position="right"-->
                         <!--v-else-if="(type === 'number') && (curRow!==''&& selectArr.indexOf(`,${row},`)>-1)"-->
                         <!--v-model="name"-->
                         <!--placeholder="请输入"-->
                         <!--@change="dealData"-->
                         <!--clearable></el-input-number>-->
        <el-input v-else-if="(type === 'number') && (curRow!==''&& selectArr.indexOf(`,${row},`)>-1)"
                         v-model="name"
                         placeholder="请输入"
                         @input="dealData2"
                         clearable></el-input>
        <span v-else>{{name}}</span>
    </div>
</template>

<script>
export default {
  name: 'level-manage',
  props: ['srcData', 'type', 'dataId', 'selData', 'row', 'curRow', 'dataName', 'selectArr'],
  data () {
    return {
      name: '',
      value: ''
    }
  },
  created () {
    this.value = this.srcData[this.dataId]
    if (this.type === 'select') {
      this.name = this.srcData[this.dataName]
    } else {
      this.name = this.srcData[this.dataId]
    }
  },
  /** 数据处理 */
  methods: {
    dealData (val) {
      this.$emit('dealSelData', val, this.row, this.dataId)
    },
    dealData2 (val) {
      val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      val = val.replace(/^\./g, '') // 验证第一个字符是数字而不是
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d{1}).*$/, '$1$2.$3')// 只能输入两个小数
      if (val.indexOf('.') < 0 && val !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val)
      }
      this.name = val
      this.$emit('dealSelData', val, this.row, this.dataId)
    }
  }
}
</script>

<style scoped>
    .el-input-number {
        width: 150px;
    }
</style>
