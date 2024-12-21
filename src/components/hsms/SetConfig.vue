<template>
    <div>
      <el-form ref="setForm" label-width="100px" class="hsms-add-dialog">
        <el-form-item label="选择模式：" prop="scheduleMode">
          <el-select v-model="scheduleMode"
                     placeholder="请选择"
                     style="width: 300px;height: 40px;"
                     @change="dealSetData">
            <el-option label="按周排班" value="WEEK" />
            <el-option label="按月排班" value="MONTH" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>

export default {
  name: 'set-config',
  props: ['data'],
  data () {
    return {
      scheduleMode: ''
    }
  },
  created () {
    this.scheduleMode = this.data
  },
  methods: {
    // 值改变处理
    dealSetData (val) {
      this.$emit('dealSetData', val)
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.el-input--small .el-input__inner {
    height: 40px !important;
    line-height: 40px !important;
  }

  .btnDiv{
    text-align: right;
    margin-top: 100px;
  }
</style>
