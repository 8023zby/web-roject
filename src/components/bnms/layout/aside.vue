<template>
  <el-container>
    <el-aside width="auto">
      <slot name="aside"></slot>
    </el-aside>
    <el-main>
      <slot name="main"></slot>
    </el-main>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot></slot>
  </el-container>
</template>

<script>
  export default {
    name: "aside_layout"
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .el-container {
    height: 100%;
  }
  .el-aside {
    overflow: visible;

    /deep/ > div {
      height: 100%;
    }
  }
  .el-main {
    padding: 0;
    margin: 12px;
    box-shadow: 0 0 3px #cccccc;

    /deep/ > div {
      height: 100%;
    }
  }
</style>
