<template>
  <div class="container">
    <el-tabs :value="activeName" @tab-click="handleClick" type="card">
<!--      <el-tab-pane label="巡视时间配置" name="first">-->
<!--        <SettingItem />-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="巡视内容配置" name="first">
        <SettingContent />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "temperature_setting",
    data() {
      return {
        activeName: "first"
      };
    },
    methods: {
      handleClick(tab) {
      }
    },
    components: {
      SettingItem: () => import("./Times"),
      SettingContent: () => import("./Contents"),
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
/*
  .container /deep/ .el-tabs {
    height: 100%;
  }
  .container /deep/ .el-tabs__nav-wrap {
    padding: 0 20px;
  }
*/
/*
  .container /deep/ .el-tabs__content{
    height: 100%;
    position: relative;

    > div {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 55px;
    }
  }
*/
</style>
