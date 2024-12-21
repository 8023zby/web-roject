<template>
  <div style="height: 100%">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="检查" name="inspect">
        <InspectList v-on="$listeners"/>
      </el-tab-pane>
      <el-tab-pane label="检验" name="examine">
        <ExamineList v-on="$listeners"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'critical_value_tabs',
  data () {
    return {
      activeName: 'inspect'
    }
  },
  methods: {
    handleClick (tab) {
      // this.$store.commit("setLabelPatientActiveName", tab.name);
    }
  },
  components: {
    InspectList: () => import('./InspectList'),
    ExamineList: () => import('./ExamineList')
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

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
