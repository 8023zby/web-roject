<template>
  <div class="container">
    <el-tabs :value="activeName" @tab-click="handleClick">
      <el-tab-pane label="体温单项目" name="first">
        <SettingItem />
      </el-tab-pane>
      <el-tab-pane label="测量时间" name="second">
        <MeasureTime />
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
      SettingItem: () => import("./SettingItem"),
      MeasureTime: () => import("./MeasureTime")
    }
  };
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    height: 100%;
    overflow: hidden;
  }
  .container /deep/ .el-tabs {
    height: 100%;
  }
  .container /deep/ .el-tabs__nav-wrap {
    padding: 0 20px;
  }
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
</style>
