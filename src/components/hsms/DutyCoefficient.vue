<template>
  <div>
    <!--el-input-number v-if="(curRow!==''&& selectArr.indexOf(`,${row},`)>-1)"
                     :min="0" :precision="1" :step="0.1"
                     v-model="value" @change="dealData"
                     controls-position="right" />
    <span v-else>{{value}}</span-->

    <el-input-number :min="0" :precision="1" :step="0.1" style="width: 148px;"
                     v-model="value" @change="dealData" />
  </div>
</template>

<script>
export default {
  name: 'duty-coefficient',
  props: ['srcData', 'row', 'curRow', 'selectArr'],
  data () {
    return {
      value: ''
    }
  },
  created () {
    this.value = this.srcData.shiftCoefficient
  },
  // 数据处理
  methods: {
    dealData (val) {
      this.$emit('dealSelData', val, this.row)
    }
  }
}
</script>

<style scoped>

</style>
