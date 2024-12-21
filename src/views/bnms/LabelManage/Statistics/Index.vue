<template>
  <div style="height: 100%">
    <el-tabs v-model="activeName" type="card">
      <!--<el-tabs :value="activeName" @tab-click="handleClick">-->
      <el-tab-pane label="统计标签" name="statistics">
        <StatisticsList v-on="$listeners"/>
      </el-tab-pane>
      <el-tab-pane label="分类管理" name="classify">
        <ClassifyList v-on="$listeners"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'manage_tabs_list',
  data () {
    return {
      activeName: 'statistics'
    }
  },
  methods: {
    handleClick (tab) {
      this.$store.commit('setLabelPatientActiveName', tab.name)
    }
  },
  components: {
    StatisticsList: () => import('./StatisticsList'),
    ClassifyList: () => import('./Classify')
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/bnms/css/self_common";

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
</style>
