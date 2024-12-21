<template>
  <el-tabs :value="activeName" type="card" style="height: 100%; position: relative">
    <el-tab-pane label="宣教内容" name="first">
      <list v-on="$listeners"></list>
    </el-tab-pane>
    <el-tab-pane label="宣教分类" name="second">
      <classify v-on="$listeners"></classify>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import list from './List'
  import classify from './ClassifyList'

  export default {
    name: "education_tab",
    data() {
      return {
        activeName: "first"
      };
    },
    components: {
      list, classify
    }
  };
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/nrms/css/self_common";
  /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }
  /deep/ .el-tabs__content {
    position: absolute;
    top: 47px;
    left: 0;
    right: 0;
    bottom: 0;
    > div {
      height: 100%;
    }
  }


</style>
