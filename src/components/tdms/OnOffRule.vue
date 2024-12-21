<template>
  <div style="width: 100%;height: 100%">
    <el-tabs v-model="tabVal" @tab-click="handleClick" style="width: 100%">
      <el-tab-pane label="常规规则" name="first" style="overflow: auto">
        <normal-rule :onOffRule="ruleData" ref="normalRule" />
      </el-tab-pane>
      <el-tab-pane label="周期规则" name="second" style="overflow: auto">
        <week-rule :onOffRule="weekData" ref="weekRule" />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer btnDiv">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="onOff">确 认</el-button>
    </div>
  </div>
</template>

<script>
import NormalRule from '../../components/tdms/NormalRule'
import WeekRule from '../../components/tdms/WeekRule'
export default {
  name: 'on-off-rule',
  components: {
    NormalRule, WeekRule
  },
  props: {
    onOffRule: {
      type: Array,
      require: true
    }
  },
  data () {
    return {
      ruleData: [],
      weekData: [],
      tabVal: 'first'
    }
  },
  created () {
    this.ruleData = [...this.onOffRule]
    this.weekData = [...this.onOffRule]
  },
  methods: {
    handleClick () {

    },
    cancelDialog () {
      this.$emit('cancelDialog')
    },
    onOff () {
      let finalData = []
      let normalRule = {
        type: '1',
        rules: this.$refs.normalRule.tableData
      }
      let weekRule = {
        type: '2',
        rules: this.$refs.weekRule.tableData
      }
      if (this.$refs.normalRule.tableData.length > 0) {
        finalData.push(normalRule)
      }
      if (this.$refs.weekRule.tableData.length > 0) {
        finalData.push(weekRule)
      }
      this.$emit('onOff', finalData)
    }
  }
}
</script>

<style scoped>
  .btnDiv{
    margin-top: 30px;
    text-align: right;
  }
</style>
