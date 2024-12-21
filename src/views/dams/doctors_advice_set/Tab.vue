<template>
  <div class="container">
    <el-tabs v-model="activeName"
             @tab-click="handleClick"
             type="card">
      <el-tab-pane label="医嘱频次"
                   name="frequency">
        <FrequencyList @option-changeds="optionChangeHandlers"
                       :tab="tabData"
                       v-on="$listeners"
                       v-if="firstFlag"/>
      </el-tab-pane>
      <el-tab-pane label="评估频次"
                   name="assess">
        <FrequencyList @option-changeds="optionChangeHandlers"
                       :tab="tabData"
                       v-on="$listeners"
                       v-if="secondFlag"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FrequencyList from './FrequencySettingList'

export default {
  name: 'setting',
  props: ['tab', 'params'],
  data: function () {
    return {
      activeName: 'frequency',
      firstFlag: true,
      secondFlag: false,
      tabData: {
        activeName: 'frequency'
      }
    }
  },
  provide () {
    return {
      tabRefresh: this.reload
    }
  },
  created () {

  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.reload(this.tab.activeName)
    },
    handleClick (tab) {
      this.reload(tab.name)
    },
    reload (act) {
      let that = this
      if (act === 'frequency') {
        this.firstFlag = false
        this.$nextTick(function () {
          that.tabData.activeName = 'frequency'
          that.activeName = 'frequency'
          that.firstFlag = true
        })
      } else {
        this.secondFlag = false
        this.$nextTick(function () {
          that.tabData.activeName = 'assess'
          that.activeName = 'assess'
          that.secondFlag = true
        })
      }
    },
    // 页面跳转
    optionChangeHandlers (optionType = 'Tab', params = {}, modifyData = {}) {
      this.$emit('option-changed', optionType, params, modifyData)
    }
  },
  components: {
    FrequencyList
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/dams/css/self_common";

  /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }

  /deep/ .el-tabs__content {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    bottom: 0;

    > div {
      height: 100%
    }
  }

  .container {
    height: 100%;
    overflow: hidden;
  }
</style>
